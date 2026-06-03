import { useGameStore } from '../../store/useGameStore';

export default function NotificationFeed() {
  const notifications = useGameStore(state => state.notifications);
  const showNotifications = useGameStore(state => state.showNotifications);

  if (!showNotifications) return null;

  return (
    <div className="fixed top-48 left-6 z-40 flex flex-col gap-2 pointer-events-none">
      {notifications.map(notif => {
        let borderColor = 'border-slate-500';
        let icon = 'ℹ️';
        if (notif.type === 'rebellion') {
          borderColor = 'border-amber-500';
          icon = '🔥';
        } else if (notif.type === 'death') {
          borderColor = 'border-red-500';
          icon = '☠️';
        } else if (notif.type === 'war') {
          borderColor = 'border-orange-500';
          icon = '⚔️';
        }

        return (
          <div 
            key={notif.id}
            className={`bg-slate-900/60 text-slate-200 px-4 py-3 rounded-lg border-l-4 ${borderColor} shadow-lg backdrop-blur-sm animate-fade-in flex items-center gap-3 w-80`}
          >
            <span className="text-xl">{icon}</span>
            <span className="text-sm font-medium">{notif.message}</span>
          </div>
        );
      })}
    </div>
  );
}
