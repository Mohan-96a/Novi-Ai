"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/support/UserContext';
import { useBot } from '@/support/BotContext';
import { IconLoader, IconExclamationCircle, IconProgressCheck } from '@tabler/icons-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

function Diary() {
    const [text, setText] = useState("")
    const [status, setStatus] = useState("")
    const { userDetails } = useUser();
    const { selectedBotId } = useBot();

    useEffect(() => {
        if(text.trim() !== "") {
            setStatus("");
        }
    },  [text])

    const handleSend = async () => {
        if (!text.trim()) {
            setStatus(<span className='flex flex-row gap-2 items-center'>
                <IconExclamationCircle size={16} className="text-white" /> Please enter some text
            </span>)
            return;
        }
        setStatus(<span className='flex flex-row gap-2 items-center'>
            <IconLoader size={16} className="text-white" /> Please wait until the bot processes your diary...
        </span>)
        try {
            const payload = {
                email: userDetails.email,
                bot_id: selectedBotId,
                text: text
            }
            const response = await fetch("https://novi.aigurukul.dev/cv/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log(data);
            setStatus(<span className='flex flex-row gap-2 items-center text-green-400'>
                <IconProgressCheck size={16} className="text-white" /> Done, your diary is sent. Now you can go back to the chat.
            </span>)
        } catch (error) {
            setStatus(<span className='flex flex-row gap-2 items-center'>
                <IconExclamationCircle size={16} className="text-white" /> Error in sending the text
            </span>)
            console.error(error);
        }
    }
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className='w-full md:max-w-lg bg-neutral-800 rounded p-5'>
                <div className="w-full">
                    <h2 className="font-bold text-xl">Diary</h2>
                </div>
                <div className='flex flex-col items-center gap-4 w-full'>
                    <div className="w-full">
                        <Textarea 
                            className="border border-slate-50 h-40 w-full mt-2" 
                            placeholder="Enter you diary here to personalize the bot further. After sending the diary, please wait a few minutes for the bot to process and personalize it for you." 
                            onChange={(e) => setText(e.target.value)} 
                        />
                    </div>
                    {status == "" ? (
                        <Button className='mt-2' onClick={handleSend}>
                            Send
                        </Button>
                    ) : (
                        <p>{status}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Diary