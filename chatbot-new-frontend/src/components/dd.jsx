import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useBot } from "@/support/BotContext";
import { useTraits } from "@/support/TraitsContext";
import { useUser } from "@/support/UserContext";
import { ChevronDown, ChevronUp } from "lucide-react";

function groupByMonth(summaries) {
  const grouped = {};
  summaries.forEach(({ summary_date, generated_summary }) => {
    const date = new Date(summary_date);
    const monthKey = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!grouped[monthKey]) grouped[monthKey] = [];
    grouped[monthKey].push({
      date: dateStr,
      isoDate: summary_date,
      content: generated_summary,
    });
  });
  return grouped;
}

function Diary() {
  const [summaries, setSummaries] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [isDetailView, setIsDetailView] = useState(false);
  const monthRefs = useRef({});
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); //state to refrsh trigger after deletion

  const { selectedBotId } = useBot();
  const { userDetails } = useUser();

  const bot_id = selectedBotId;
  const email = userDetails.email;

  useEffect(() => {
    const fetchSummaries = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://novi.aigurukul.dev/get-summaries/${email}/${bot_id}`
        );
        if (!res.ok) {
          const errorText = await res.text();
          console.error(
            `HTTP error! status: ${res.status}, body: ${errorText}`
          );
          setLoading(false);
          return;
        }
        const data = await res.json();
        console.log(data);

        if (data && Array.isArray(data.summaries)) {
          const grouped = groupByMonth(data.summaries);
          setSummaries(grouped);
          if (Object.keys(grouped).length > 0) {
            const firstMonth = Object.keys(grouped)[0];
            setSelectedMonth(firstMonth);
            setSelectedLog(grouped[firstMonth]?.[0]);
            setLoading(false);
          } else {
            setLoading(false);
          }
        } else {
          console.error(
            "API response did not contain a valid 'summaries' array:",
            data
          );
          setSummaries({}); // Or handle the error state as needed
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch summaries", err);
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [email, bot_id, refreshTrigger]); //refetch the summaries if email, bot_id or refreshTrigger changes

  const handleScrollToMonth = (month) => {
    setSelectedMonth(month);
    setSelectedLog(summaries[month][0]);
    monthRefs.current[month]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const toggleEntrySelection = (date) => {
    setSelectedEntries((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const deleteSelectedEntries = async () => {
    try {
      await Promise.all(
        selectedEntries.map(async (isoDate) => {
          await fetch("https://novi.aigurukul.dev/delete-summary", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              bot_id,
              summary_date: isoDate,
            }),
          });
        })
      );

      const updatedSummaries = { ...summaries };
      for (const month in updatedSummaries) {
        updatedSummaries[month] = updatedSummaries[month].filter(
          (log) => !selectedEntries.includes(log.isoDate)
        );
      }

      setSummaries(updatedSummaries);
      setSelectedEntries([]);
      setEditMode(false);

      const remainingLogs = Object.values(updatedSummaries).flat();
      if (remainingLogs.length > 0) {
        const newMonth = Object.keys(updatedSummaries).find(
          (m) => updatedSummaries[m].length > 0
        );
        setSelectedMonth(newMonth);
        setSelectedLog(updatedSummaries[newMonth][0]);
      } else {
        setSelectedMonth("");
        setSelectedLog(null);
      }
      setRefreshTrigger(prev => prev + 1);  //triggers when there is deletion of the summaries
    } catch (err) {
      console.error("Failed to delete summaries", err);
    }
  };

  if (Object.keys(summaries).length === 0) {
    return (
      <div className="h-full max-w-7xl mx-auto flex flex-col">
               {" "}
        <div className="flex-none px-6 border-b border-gray-200">
                   {" "}
          <div className="flex">
                       {" "}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Diary
            </h1>
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <div className="flex-1 flex items-center justify-center text-gray-500">
                    No summaries available.        {" "}
        </div>
             {" "}
      </div>
    );
  }

  return (
    <div className="h-full max-w-7xl mx-auto p-2">
      {/* Mobile Detail View */}
      <div
        className={`fixed inset-0 bg-white z-50 md:hidden ${
          isDetailView ? "block" : "hidden"
        }`}
      >
        <div className="p-4 flex items-center gap-4 border-b border-gray-200">
          <button onClick={() => setIsDetailView(false)}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold">{selectedLog?.date}</h2>
        </div>
        {/* Add a scrollable container for the content */}
        <div className="overflow-y-auto h-[calc(100%-70px)]">
          <div className="p-6">
            <p className="text-lg leading-relaxed whitespace-pre-line">
              {selectedLog?.content}
            </p>
          </div>
        </div>
        
        {/* <div className="p-6">
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {selectedLog?.content}
          </p>
        </div> */}
      </div>

      <div className="h-full flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="p-2 pt-4 flex-none md:px-6 md:py-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Diary
            </h1>
            <button
              onClick={() => setEditMode(!editMode)}
              className="sm:py-2 px-6 mr-12 md:mr-20 py-2 text-md font-semibold rounded-2xl bg-white/30 hover:bg-gray-300 text-gray-700 transition-all duration-300"
            >
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Panel - Diary Entries */}

          <div className="mt-4 md:mt-0 w-full md:w-2/5 lg:w-1/3 flex flex-col h-full border-r border-gray-200">
            <div className="p-2 flex-none md:p-6">
              <MonthDropdown
                summaries={summaries}
                selectedMonth={selectedMonth}
                handleMonthSelect={handleScrollToMonth}
              />
            </div>

            <div className="flex-1 overflow-y-auto px-2 md:px-6 pb-6">
              <div className="space-y-6">
                {Object.keys(summaries).map((month) => (
                  <div
                    key={month}
                    ref={(el) => (monthRefs.current[month] = el)}
                    className="space-y-3"
                  >
                    <h2 className="text-md font-bold text-gray-700 top-0 py-2">
                      {month}
                    </h2>
                    {summaries[month]?.map((log, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {editMode && (
                          <div
                            className={`w-5 h-5 cursor-pointer rounded-md border-2 border-white/50 transition-all duration-200 flex items-center justify-center ${
                              selectedEntries.includes(log.isoDate)
                                ? "bg-white/40"
                                : "bg-white/10"
                            }`}
                            onClick={() => toggleEntrySelection(log.isoDate)}
                          >
                            {selectedEntries.includes(log.isoDate) && (
                              <svg
                                className="w-3 h-3 text-gray-800 fill-current"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                        <button
                          className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                            selectedLog?.isoDate === log.isoDate
                              ? "bg-white/50"
                              : "bg-white/20 hover:bg-white/30 text-gray-700"
                          }`}
                          onClick={() => {
                            setSelectedLog(log);
                            if (window.innerWidth < 768) {
                              setIsDetailView(true);
                            }
                          }}
                        >
                          <div className="font-semibold mb-1">{log.date}</div>
                          <div className="text-sm opacity-90 line-clamp-2">
                            {log.content}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {editMode && (
              <div className="flex-none px-6 pb-6 pt-3 border-t border-white">
                <div className="flex gap-3">
                  <button
                    className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-400 text-white hover:bg-gray-600 transition-colors"
                    onClick={deleteSelectedEntries}
                  >
                    Delete
                  </button>
                  <button
                    className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-400 text-white hover:bg-gray-600 transition-colors"
                    onClick={() =>
                      setSelectedEntries(
                        Object.values(summaries)
                          .flat()
                          .map((entry) => entry.isoDate)
                      )
                    }
                  >
                    Select All
                  </button>
                  <button
                    className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-400 text-white hover:bg-gray-600 transition-colors"
                    onClick={() => setSelectedEntries([])}
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Right Panel - Selected Diary Content */}
          <div className="hidden w-full md:w-3/5 lg:w-2/3 md:flex flex-col h-full overflow-y-auto">
            <div className="flex-1 p-6 md:p-12">
              {selectedLog ? (
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-2xl font-bold text-gray-800 mb-4">
                    {selectedLog.date}
                  </h2>
                  <p className="text-md text-gray-700 whitespace-pre-line">
                    {selectedLog.content}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a diary entry to view its content.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Diary;

function MonthDropdown({ summaries, selectedMonth, handleMonthSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={toggleOpen}
        className="w-full p-3 bg-white/70 backdrop-blur-sm border border-white/20 text-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
      >
        {selectedMonth || "March 2025"}
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <div className="absolute mt-2 top-full left-0 right-0 bg-gray-100 backdrop-blur-3xl shadow-md rounded-xl z-10 overflow-hidden">
          <div className="py-2 px-3">
            {Object.keys(summaries).map((month) => (
              <button
                key={month}
                onClick={() => {
                  handleMonthSelect(month);
                  toggleOpen();
                }}
                className={`w-full rounded-full text-left px-4 py-2 hover:bg-gray-300 ${
                  selectedMonth === month ? "bg-gray-200" : ""
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
