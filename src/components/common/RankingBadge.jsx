import React from 'react';

const RankingBadge = ({ rank, className = '', size = 'md', showLabel = true }) => {
  const getRankingConfig = (rank) => {
    if (rank === 1) {
      return {
        bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
        text: 'text-white',
        border: 'border-yellow-600',
        icon: '🥇',
        label: 'อันดับ 1',
        shadow: 'shadow-lg shadow-yellow-500/30'
      };
    } else if (rank === 2) {
      return {
        bg: 'bg-gradient-to-br from-gray-300 to-gray-500',
        text: 'text-white',
        border: 'border-gray-500',
        icon: '🥈',
        label: 'อันดับ 2',
        shadow: 'shadow-lg shadow-gray-400/30'
      };
    } else if (rank === 3) {
      return {
        bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
        text: 'text-white',
        border: 'border-orange-600',
        icon: '🥉',
        label: 'อันดับ 3',
        shadow: 'shadow-lg shadow-orange-500/30'
      };
    } else if (rank <= 10) {
      return {
        bg: 'bg-gradient-to-br from-purple-500 to-purple-700',
        text: 'text-white',
        border: 'border-purple-700',
        icon: '🏆',
        label: `Top 10`,
        shadow: 'shadow-md shadow-purple-500/25'
      };
    } else if (rank <= 44) {
      return {
        bg: 'bg-gradient-to-br from-green-500 to-green-700',
        text: 'text-white',
        border: 'border-green-700',
        icon: '⭐',
        label: `Top 44`,
        shadow: 'shadow-md shadow-green-500/25'
      };
    } else {
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        icon: null,
        label: `อันดับ ${rank}`,
        shadow: 'shadow-sm'
      };
    }
  };

  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'text-base',
      fontSize: 'text-xs'
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'text-lg',
      fontSize: 'text-sm'
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'text-xl',
      fontSize: 'text-base'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const config = getRankingConfig(rank);

  return (
    <div
      className={`
        inline-flex items-center justify-center
        ${config.bg}
        ${config.text}
        border ${config.border}
        ${config.shadow}
        rounded-full font-bold
        ${currentSize.container}
        ${className}
        transform transition-all duration-200
        hover:scale-105 hover:shadow-xl
        animate-pulse-once
      `}
      title={`${config.label} - อันดับที่ ${rank}`}
    >
      {config.icon && (
        <span className={`${currentSize.icon} mr-1`}>
          {config.icon}
        </span>
      )}

      {showLabel && (
        <span className={currentSize.fontSize}>
          {rank <= 44 ? `#${rank}` : rank}
        </span>
      )}
    </div>
  );
};

// Special component for Top 44 display
export const Top44RankingBadge = ({ rank, className = '' }) => {
  const getTop44Config = (rank) => {
    if (rank <= 3) {
      return {
        bg: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600',
        text: 'text-white',
        border: 'border-yellow-700',
        shadow: 'shadow-lg shadow-yellow-500/40'
      };
    } else if (rank <= 10) {
      return {
        bg: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
        text: 'text-white',
        border: 'border-purple-800',
        shadow: 'shadow-lg shadow-purple-500/40'
      };
    } else if (rank <= 20) {
      return {
        bg: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
        text: 'text-white',
        border: 'border-blue-800',
        shadow: 'shadow-md shadow-blue-500/30'
      };
    } else if (rank <= 30) {
      return {
        bg: 'bg-gradient-to-br from-green-500 via-green-600 to-green-700',
        text: 'text-white',
        border: 'border-green-800',
        shadow: 'shadow-md shadow-green-500/30'
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700',
        text: 'text-white',
        border: 'border-gray-800',
        shadow: 'shadow-md shadow-gray-500/30'
      };
    }
  };

  const config = getTop44Config(rank);

  return (
    <div
      className={`
        relative
        ${config.bg}
        ${config.text}
        ${config.border}
        ${config.shadow}
        rounded-lg px-3 py-2
        flex items-center justify-center
        font-bold text-lg
        min-w-[60px]
        transform transition-all duration-300
        hover:scale-110 hover:rotate-3 hover:shadow-2xl
        ${className}
      `}
      title={`อันดับที่ ${rank} จาก 44 อันดับแรก`}
    >
      <span className="text-2xl mr-1">
        {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : '⭐'}
      </span>
      <span className="text-xl">
        {rank}
      </span>

      {/* Special effect for top 3 */}
      {rank <= 3 && (
        <div className="absolute inset-0 rounded-lg animate-ping opacity-20">
          <div className={`${config.bg} w-full h-full rounded-lg`} />
        </div>
      )}
    </div>
  );
};

// Special component for VDO Call Top 10
export const VDOCallTop10Badge = ({ rank, className = '' }) => {
  const getVDOCallConfig = (rank) => {
    if (rank === 1) {
      return {
        bg: 'bg-gradient-to-br from-red-500 to-pink-600',
        icon: '🎥',
        label: 'Director'
      };
    } else if (rank === 2) {
      return {
        bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        icon: '🎬',
        label: 'Producer'
      };
    } else if (rank === 3) {
      return {
        bg: 'bg-gradient-to-br from-green-500 to-teal-600',
        icon: '🎭',
        label: 'Actor'
      };
    } else if (rank <= 5) {
      return {
        bg: 'bg-gradient-to-br from-purple-500 to-purple-700',
        icon: '🌟',
        label: 'Star'
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-indigo-500 to-blue-600',
        icon: '💫',
        label: 'Rising'
      };
    }
  };

  const config = getVDOCallConfig(rank);

  return (
    <div
      className={`
        ${config.bg}
        text-white
        rounded-xl px-4 py-3
        flex flex-col items-center
        shadow-lg shadow-blue-500/30
        transform transition-all duration-300
        hover:scale-105 hover:shadow-xl hover:rotate-2
        min-w-[80px]
        ${className}
      `}
      title={`VDO Call อันดับที่ ${rank} - ${config.label}`}
    >
      <span className="text-2xl mb-1">{config.icon}</span>
      <span className="font-bold text-lg">{rank}</span>
      <span className="text-xs opacity-90">{config.label}</span>
    </div>
  );
};

export default RankingBadge;