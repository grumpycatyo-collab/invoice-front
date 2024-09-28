"use client";

import { useState, useEffect } from 'react';
import Modal from '@/components/shared/modal'; // Adjust the import path as needed
import { cn } from "@/lib/utils";

interface InspectModalProps {
  fileId: string | null;
  onClose: () => void;
}

export default function InspectModal({ fileId, onClose }: InspectModalProps) {
  const [fileDetails, setFileDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (fileId) {
      // Simulate API call to /inspect
      setLoading(true);
      setTimeout(() => {
        setFileDetails({
          name: 'example.pdf',
          type: 'application/pdf',
          size: 1024000,
          content: 'Mock content of the file...'
        });
        setLoading(false);
      }, 1000);
    }
  }, [fileId]);

  const handleCloseModal = () => {
    setShowModal(false);
    onClose();
  };

  if (!fileId) return null;

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className={cn(
        "w-full overflow-hidden",
        "md:max-w-md md:rounded-2xl md:border md:border-gray-200"
      )}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">File Details</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="mt-2">
              <p><strong>File name:</strong> {fileDetails.name}</p>
              <p><strong>File type:</strong> {fileDetails.type}</p>
              <p><strong>File size:</strong> {fileDetails.size} bytes</p>
              <p><strong>Content:</strong> {fileDetails.content}</p>
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}