"use client";

import { useState } from 'react';
import { X, Calendar, Clock, MapPin, Image as ImageIcon } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { createEvent } from '@/lib/actions';

interface AddEventProps {
  onClose: () => void;
  onEventCreated: (eventData: any) => void;
}

const AddEvent = ({ onClose, onEventCreated }: AddEventProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    image: undefined as string | undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date) return;
    
    setIsSubmitting(true);
    
    try {
      const event = await createEvent(formData);
      onEventCreated(event);
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: undefined }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-[1px] bg-black/5" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create Event</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                className="w-full p-3 bg-muted border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your event..."
                rows={3}
                className="w-full p-3 bg-muted border border-secondary rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 bg-muted border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 bg-muted border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter event location"
                  className="w-full pl-10 pr-3 py-3 bg-muted border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Image Upload */}
            {formData.image && (
              <div className="relative">
                <Image
                  src={formData.image}
                  alt="Event"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Upload Button */}
            <div className="border-t border-gray-200 pt-4">
              <CldUploadWidget
                uploadPreset="circleup"
                options={{
                  maxFiles: 1,
                  resourceType: "image",
                  folder: "events",
                  showUploadMoreButton: false,
                  sources: ["local", "url", "camera"],
                  showAdvancedOptions: true,
                  cropping: true,
                  styles: {
                    palette: {
                      window: "#F4F2EE",
                      windowBorder: "#641a0f",
                      tabIcon: "#ae8d44",
                      inactiveTabIcon: "#641a0f",
                      link: "#641a0f",
                      action: "#C7A04C",
                      inProgress: "#C7A04C",
                      complete: "#20B832",
                      error: "#E63946",
                      textDark: "#641a0f",
                      textLight: "#FFFFFF",
                      sourceBg: "#F4F2EE",
                      sourceTextActive: "#C7A04C"
                    },
                    frame: {
                      background: "rgba(0, 0, 0, 0.3)"
                    }
                  }
                }}
                onSuccess={(result) => {
                  if (typeof result.info === 'object' && result.info && 'secure_url' in result.info) {
                    setFormData(prev => ({ ...prev, image: result.info.secure_url as string }));
                    setIsUploading(false);
                  }
                }}
                onError={(error) => {
                  console.error("Cloudinary upload error:", error);
                  setIsUploading(false);
                }}
                onClose={() => {
                  setIsUploading(false);
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploading(true);
                      open();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ImageIcon size={18} />
                    {isUploading ? "Uploading..." : "Add Event Photo"}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.title || !formData.date}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
