import type { User } from '../types';

interface Props {
  user: User;
  partner: User | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { avatar: 'w-10 h-10', text: 'text-sm', ring: 'w-6 h-6', gap: '-space-x-2' },
  md: { avatar: 'w-14 h-14', text: 'text-lg', ring: 'w-8 h-8', gap: '-space-x-3' },
  lg: { avatar: 'w-20 h-20', text: 'text-2xl', ring: 'w-10 h-10', gap: '-space-x-4' },
};

export default function CoupleAvatar({ user, partner, size = 'md', className = '' }: Props) {
  const s = SIZES[size];

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`flex items-center ${s.gap}`}>
        <Avatar
          name={user.name}
          photoUrl={user.photo_url}
          sizeClass={s.avatar}
          textClass={s.text}
          gradient="from-orange-400 to-rose-400"
          zIndex="z-20"
        />

        <div className={`${s.ring} rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center z-30 ring-2 ring-white dark:ring-gray-900 shadow-lg`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="text-white"
            style={{ width: '60%', height: '60%' }}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="currentColor"
            />
          </svg>
        </div>

        {partner ? (
          <Avatar
            name={partner.name}
            photoUrl={partner.photo_url}
            sizeClass={s.avatar}
            textClass={s.text}
            gradient="from-sky-400 to-teal-400"
            zIndex="z-10"
          />
        ) : (
          <div className={`${s.avatar} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center z-10 ring-2 ring-white dark:ring-gray-900`}>
            <span className={`${s.text} text-gray-400 dark:text-gray-500`}>?</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({
  name,
  photoUrl,
  sizeClass,
  textClass,
  gradient,
  zIndex,
}: {
  name: string;
  photoUrl?: string;
  sizeClass: string;
  textClass: string;
  gradient: string;
  zIndex: string;
}) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${sizeClass} rounded-full object-cover ${zIndex} ring-2 ring-white dark:ring-gray-900 shadow-md`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center ${zIndex} ring-2 ring-white dark:ring-gray-900 shadow-md`}
    >
      <span className={`${textClass} font-bold text-white`}>{name?.[0] || '?'}</span>
    </div>
  );
}
