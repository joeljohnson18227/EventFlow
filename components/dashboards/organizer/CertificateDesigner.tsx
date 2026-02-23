'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Type, Move, Trash2, Save, CheckCircle2 } from 'lucide-react';

interface Element {
    id: string;
    type: 'text' | 'image';
    content: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    align: 'left' | 'center' | 'right';
}

interface Props {
    event: any;
    onSave: () => void;
}

export default function CertificateDesigner({ event, onSave }: Props) {
    const [backgroundUrl, setBackgroundUrl] = useState(event.certificateTemplate?.backgroundUrl || '');
    const [elements, setElements] = useState<Element[]>(event.certificateTemplate?.elements || [
        {
            id: 'recipient-name',
            type: 'text',
            content: '{{RECIPIENT_NAME}}',
            x: 400,
            y: 300,
            fontSize: 40,
            color: '#000000',
            align: 'center'
        }
    ]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Canvas rendering logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let isMounted = true;

        const render = async () => {
            // Clear background
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background
            if (backgroundUrl) {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                const loadPromise = new Promise((resolve) => {
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                });
                img.src = backgroundUrl;

                const success = await loadPromise;
                if (success && isMounted) {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                } else if (isMounted) {
                    drawPlaceholder(ctx, canvas);
                }
            } else if (isMounted) {
                drawPlaceholder(ctx, canvas);
            }

            if (!isMounted) return;

            // Draw elements
            elements.forEach((el) => {
                ctx.font = `${el.fontSize}px Helvetica`;
                ctx.fillStyle = el.color;
                ctx.textAlign = el.align;

                let displayText = el.content;
                if (displayText === '{{RECIPIENT_NAME}}') displayText = 'John Doe (Sample)';
                if (displayText === '{{EVENT_TITLE}}') displayText = event.title;

                ctx.fillText(displayText, el.x, el.y);

                // Draw selection highlight
                if (selectedId === el.id) {
                    ctx.strokeStyle = '#6366f1';
                    ctx.lineWidth = 2;
                    const metrics = ctx.measureText(displayText);
                    let startX = el.x;
                    if (el.align === 'center') startX = el.x - metrics.width / 2;
                    if (el.align === 'right') startX = el.x - metrics.width;

                    ctx.strokeRect(startX - 5, el.y - el.fontSize, metrics.width + 10, el.fontSize + 10);
                }
            });
        };

        const drawPlaceholder = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#e2e8f0';
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
            ctx.setLineDash([]);
        };

        render();

        return () => { isMounted = false; };
    }, [backgroundUrl, elements, selectedId, event.title]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setBackgroundUrl(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Simple hit detection
        const ctx = canvas.getContext('2d');
        const clickedEl = elements.findLast((el) => {
            ctx!.font = `${el.fontSize}px Helvetica`;
            const metrics = ctx!.measureText(el.content.replace('{{RECIPIENT_NAME}}', 'John Doe (Sample)').replace('{{EVENT_TITLE}}', event.title));
            let startX = el.x;
            if (el.align === 'center') startX = el.x - metrics.width / 2;
            if (el.align === 'right') startX = el.x - metrics.width;

            return x >= startX - 5 && x <= startX + metrics.width + 5 &&
                y >= el.y - el.fontSize && y <= el.y + 10;
        });

        setSelectedId(clickedEl?.id || null);
    };

    const handleDrag = (e: React.MouseEvent) => {
        if (!selectedId || e.buttons !== 1) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = Math.round((e.clientX - rect.left) * scaleX);
        const y = Math.round((e.clientY - rect.top) * scaleY);

        setElements(elements.map(el =>
            el.id === selectedId ? { ...el, x, y } : el
        ));
    };

    const addText = () => {
        const newEl: Element = {
            id: `text-${Date.now()}`,
            type: 'text',
            content: 'New Text',
            x: 421,
            y: 297,
            fontSize: 24,
            color: '#000000',
            align: 'center'
        };
        setElements([...elements, newEl]);
        setSelectedId(newEl.id);
    };

    const removeSelected = () => {
        if (!selectedId) return;
        setElements(elements.filter(el => el.id !== selectedId));
        setSelectedId(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            const res = await fetch(`/api/events/${event._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    certificateTemplate: {
                        backgroundUrl,
                        elements
                    }
                })
            });

            if (res.ok) {
                setSaveStatus('success');
                onSave();
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const selectedEl = elements.find(el => el.id === selectedId);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Toolbar */}
            <div className="lg:w-64 space-y-6">
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Canvas Tools</h4>
                    <button
                        onClick={addText}
                        className="w-full flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        <Type className="w-4 h-4" />
                        Add Text
                    </button>
                    <div className="relative">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <Upload className="w-4 h-4" />
                            Bg Image
                        </button>
                        <input
                            type="text"
                            placeholder="Or Image URL"
                            className="mt-2 w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                            value={backgroundUrl.startsWith('data:') ? '' : backgroundUrl}
                            onChange={(e) => setBackgroundUrl(e.target.value)}
                        />
                    </div>
                </div>

                {selectedEl && (
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                        <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Properties</h4>

                        <div className="space-y-2">
                            <label className="text-xs text-slate-500">Content</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                                value={selectedEl.content}
                                onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, content: e.target.value } : el))}
                            />
                            <div className="flex flex-wrap gap-1">
                                <button
                                    onClick={() => setElements(elements.map(el => el.id === selectedId ? { ...el, content: '{{RECIPIENT_NAME}}' } : el))}
                                    className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded"
                                >
                                    Recipient Name
                                </button>
                                <button
                                    onClick={() => setElements(elements.map(el => el.id === selectedId ? { ...el, content: '{{EVENT_TITLE}}' } : el))}
                                    className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded"
                                >
                                    Event Titile
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500">Font Size</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none text-slate-900"
                                    value={selectedEl.fontSize}
                                    onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, fontSize: parseInt(e.target.value) } : el))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500">Color</label>
                                <input
                                    type="color"
                                    className="w-full h-9 p-1 border border-slate-200 rounded-lg cursor-pointer"
                                    value={selectedEl.color}
                                    onChange={(e) => setElements(elements.map(el => el.id === selectedId ? { ...el, color: e.target.value } : el))}
                                />
                            </div>
                        </div>

                        <button
                            onClick={removeSelected}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Element
                        </button>
                    </div>
                )}

                <div className="pt-6 border-t border-slate-100">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Template
                            </>
                        )}
                    </button>
                    {saveStatus === 'success' && (
                        <p className="mt-2 text-center text-xs text-emerald-600 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Template saved!
                        </p>
                    )}
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-auto bg-slate-100 p-8 rounded-2xl flex items-center justify-center min-h-[600px]">
                <div
                    ref={containerRef}
                    className="relative bg-white shadow-2xl overflow-hidden cursor-crosshair"
                    style={{ width: '842px', height: '595px' }}
                >
                    <canvas
                        ref={canvasRef}
                        width={842}
                        height={595}
                        onClick={handleCanvasClick}
                        onMouseMove={handleDrag}
                        className="absolute inset-0 w-full h-full"
                    />

                    {/* Instructions Overlay if empty */}
                    {!backgroundUrl && elements.length === 1 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                            <Move className="w-12 h-12 text-slate-400 mb-2" />
                            <p className="text-lg font-medium text-slate-500">Drag to Position Fields</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
