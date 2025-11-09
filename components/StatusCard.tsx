import React from "react";

interface StatusCardProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
    chinldren?: React.ReactNode;
}

export function StatusCard({
    title,
    description,
    action,
    className = "",
    children,
}: StatusCardProps) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div>
                {children}
                <div>{title}</div>
                {description && <div>{description}</div>}
                {action && <div>{action}</div>}
            </div>
        </div>
    );
}
