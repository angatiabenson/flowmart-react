import React, { useState, useRef, useEffect } from 'react';
import { cn } from './primitives';

interface DropdownMenuProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'start' | 'end' | 'center';
    side?: 'top' | 'bottom' | 'left' | 'right';
}

export const DropdownMenu = ({ trigger, children, align = 'start', side = 'bottom' }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const getPositionClasses = () => {
        const classes = ['absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80'];
        
        if (side === 'bottom') classes.push('top-full mt-2');
        if (side === 'top') classes.push('bottom-full mb-2');
        if (side === 'right') classes.push('left-full ml-2');
        if (side === 'left') classes.push('right-full mr-2');

        if ((side === 'top' || side === 'bottom') && align === 'start') classes.push('left-0');
        if ((side === 'top' || side === 'bottom') && align === 'end') classes.push('right-0');
        if ((side === 'top' || side === 'bottom') && align === 'center') classes.push('left-1/2 -translate-x-1/2');

        return cn(classes);
    };

    return (
        <div className="relative inline-block text-left" ref={containerRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>
            {isOpen && (
                <div className={getPositionClasses()}>
                    {children}
                </div>
            )}
        </div>
    );
};

export const DropdownMenuItem = ({ className, children, onClick, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'destructive' }) => {
    return (
        <div
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
                variant === 'destructive' && "text-destructive focus:text-destructive hover:bg-destructive/10",
                className
            )}
            onClick={(e) => {
                onClick?.(e);
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export const DropdownMenuSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
);

export const DropdownMenuLabel = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
);
