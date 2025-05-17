'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Toaster, toast } from 'react-hot-toast';
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        treatment: '',
        hasDate: false,
        plannedDate: null as Date | null,
        message: ''
    });

    const treatments = [
        'General Surgery',
        'Orthopedics',
        'Cardiology',
        'Neurology',
        'Oncology',
        'Dental',
        'Other'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submitPromise = fetch('/api/submit-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit request');
            }
            return data;
        });

        toast.promise(submitPromise, {
            loading: 'Submitting request...',
            success: () => {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    treatment: '',
                    hasDate: false,
                    plannedDate: null,
                    message: ''
                });
                return 'Request submitted successfully!';
            },
            error: (err) => err.message || 'Error submitting form. Please try again.'
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Toaster position="top-center" />
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Request A Quote</h1>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Treatment of Interest</label>
                            <select
                                required
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                                value={formData.treatment}
                                onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                            >
                                <option value="">Select Treatment</option>
                                {treatments.map((treatment) => (
                                    <option key={treatment} value={treatment}>
                                        {treatment}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">When do you plan to have the treatment?</label>
                        <div className="flex flex-col gap-2">
                            <label className="inline-flex items-center cursor-pointer">
                                <span className="relative">
                                    <input
                                        type="radio"
                                        name="dateChoice"
                                        checked={formData.hasDate}
                                        onChange={() => setFormData({...formData, hasDate: true})}
                                        className="sr-only"
                                    />
                                    <span className={`w-4 h-4 inline-block rounded-full border-2 border-primary-400 transition-all duration-200 ${formData.hasDate ? 'ring-2 ring-primary-400' : ''} flex items-center justify-center`}>
                                        {formData.hasDate && <span className="w-2 h-2 bg-primary-400 rounded-full block"></span>}
                                    </span>
                                </span>
                                <span className="ml-2 text-sm text-gray-700">I have a date in mind</span>
                            </label>
                            <label className="inline-flex items-center cursor-pointer">
                                <span className="relative">
                                    <input
                                        type="radio"
                                        name="dateChoice"
                                        checked={!formData.hasDate}
                                        onChange={() => setFormData({...formData, hasDate: false, plannedDate: null})}
                                        className="sr-only"
                                    />
                                    <span className={`w-4 h-4 inline-block rounded-full border-2 border-primary-400 transition-all duration-200 ${!formData.hasDate ? 'ring-2 ring-primary-400' : ''} flex items-center justify-center`}>
                                        {!formData.hasDate && <span className="w-2 h-2 bg-primary-400 rounded-full block"></span>}
                                    </span>
                                </span>
                                <span className="ml-2 text-sm text-gray-700">I don&apos;t have a date in mind</span>
                            </label>
                            {formData.hasDate && (
                                <DatePicker
                                    selected={formData.plannedDate}
                                    onChange={(date: Date | null) => setFormData({...formData, plannedDate: date})}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition mt-1"
                                    placeholderText="Select a date"
                                />
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                        <textarea
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                            rows={3}
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary-500 text-black py-2 px-4 rounded-lg font-semibold shadow hover:bg-primary-600 transition"
                    >
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
}
