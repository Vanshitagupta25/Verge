import toast from 'react-hot-toast';

export const successToast = (message: string) => {
  toast.success(message, {
    style: {
      borderRadius: '10px',
      background: '#1f2937',
      color: '#fff',
      border: '1px solid #374151',
    },
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    style: {
      borderRadius: '10px',
      background: '#1f2937',
      color: '#fff',
      border: '1px solid #ef4444',
    },
  });
};