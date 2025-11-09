'use client'

import React from 'react'

import {
    CallControls,
    CallingState,
    SpeakerLayout,
    useCallStateHooks
} from '@stream-io/video-react-sdk';
import { useSidebar } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { StatusCard } from '@/components/StatusCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Check, Copy } from 'lucide-react';

function VideoCall() {
    const { useCallCallingState, useParticipants } = useCallStateHooks();
    const callingState = useCallCallingState();
    const participants = useParticipants();
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const { setOpen } = useSidebar();

    const handleLeave = () => {
        router.push('/dashboard');
        setOpen(true)
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    }

    if (callingState === CallingState.JOINING) {
        return (
            <StatusCard
                title="Joining Call..."
                description='please wait '
                className='bg-gray-300'
            >
                <LoadingSpinner />

            </StatusCard>
        )
    }

    if (callingState === CallingState.RECONNECTING) {
        return (
            <StatusCard
                title="Reconnecting to Call..."
                description='please wait '
                className='bg-gray-300'
            >
                <LoadingSpinner />
            </StatusCard>
        )
    }




    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Video Layout */}
            <div className="w-full rounded-lg overflow-hidden bg-black/20">
                <SpeakerLayout />
            </div>

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-4">
                <CallControls onLeave={handleLeave} />
            </div>

            {/* Waiting Screen */}
            {participants.length === 1 && (
                <div className="w-full max-w-md mx-auto">
                    <div className="flex flex-col items-center gap-4 rounded-xl border border-zinc-700 bg-zinc-900/60 p-6 shadow-lg">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800">
                            <Copy className="text-white w-6 h-6" />
                        </div>

                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-white">
                                Waiting for others
                            </h2>
                            <p className="text-sm text-zinc-400">
                                Share this link to invite others to the call
                            </p>
                        </div>

                        <div className="w-full bg-zinc-800 rounded-md p-3 flex items-center justify-between text-xs text-zinc-300">
                            <span className="truncate">{window.location.href}</span>
                            <button
                                onClick={copyToClipboard}
                                className="ml-2 whitespace-nowrap flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy Link
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-zinc-500">
                            Others will be able to join once they have the link.
                        </p>
                    </div>
                </div>
            )}
        </div>

    )
}

export default VideoCall