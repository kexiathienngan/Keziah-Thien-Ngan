import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-main border-t-accent border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-secondary text-lg">Đang tìm Lời Chúa cho bạn...</p>
    </div>
  );
};

export default LoadingSpinner;