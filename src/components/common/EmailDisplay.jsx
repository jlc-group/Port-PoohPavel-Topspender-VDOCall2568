import React from 'react';

const EmailDisplay = ({ email, className = '', showAvatar = true, size = 'md' }) => {
  if (!email) {
    return (
      <span className={`text-gray-400 text-sm ${className}`}>
        ไม่มีอีเมล์
      </span>
    );
  }

  // Generate initials from email for avatar
  const generateInitials = (email) => {
    const namePart = email.split('@')[0];
    const parts = namePart.split(/[._-]/);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (namePart.length >= 2) {
      return namePart.substring(0, 2).toUpperCase();
    }
    return namePart.substring(0, 1).toUpperCase();
  };

  // Generate avatar color based on email
  const generateAvatarColor = (email) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-rose-500'
    ];

    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const sizeClasses = {
    sm: {
      avatar: 'w-6 h-6 text-xs',
      text: 'text-xs',
      container: 'gap-2'
    },
    md: {
      avatar: 'w-8 h-8 text-sm',
      text: 'text-sm',
      container: 'gap-2'
    },
    lg: {
      avatar: 'w-10 h-10 text-base',
      text: 'text-base',
      container: 'gap-3'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {showAvatar && (
        <div
          className={`
            ${currentSize.avatar}
            ${generateAvatarColor(email)}
            rounded-full
            flex items-center justify-center
            text-white font-semibold
            flex-shrink-0
            shadow-sm
            hover:shadow-md transition-shadow duration-200
          `}
          title={email}
        >
          {generateInitials(email)}
        </div>
      )}

      <div className="flex flex-col min-w-0">
        <span
          className={`
            ${currentSize.text}
            font-medium text-gray-900
            truncate
            hover:text-blue-600
            transition-colors duration-200
            cursor-pointer
          `}
          title={email}
          onClick={() => {
            if (email) {
              window.location.href = `mailto:${email}`;
            }
          }}
        >
          {email}
        </span>
      </div>
    </div>
  );
};

export default EmailDisplay;