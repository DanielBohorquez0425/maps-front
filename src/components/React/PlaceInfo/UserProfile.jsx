import { IconLogout } from "../../../assets/icons/icons";
import { logout } from "../../../services/axios";

export default function UserProfile({
  userName = "Usuario",
  userStatus = "activo",
  avatarSrc = null,
  avatarColor = "bg-amber-200",
  onLogout = () => {},
  showLogout = true,
  className = "",
}) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "activo":
      case "online":
        return "bg-green-400";
      case "ausente":
      case "away":
        return "bg-yellow-400";
      case "ocupado":
      case "busy":
        return "bg-red-400";
      case "desconectado":
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div
      className={`flex gap-3 items-center text-white justify-between pt-2 border-t border-[#585870] ${className}`}
    >
      <div className="flex gap-3 items-center flex-1 min-w-0">
        {/* Avatar */}
        <div
          className={`min-w-[50px] h-[50px] rounded-full flex items-center justify-center ${avatarColor} overflow-hidden`}
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={`Avatar de ${userName}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-black font-bold text-lg">
              {getInitials(userName)}
            </span>
          )}
        </div>

        {/* User info */}
        <div className="flex flex-col min-w-0 flex-1">
          <p className="font-semibold truncate" title={userName}>
            {userName}
          </p>
          <div
            className={`flex items-center gap-2 bg-[#585870] w-fit px-2 ${getStatusColor(
              userStatus
            )} rounded-full`}
          >
            <p className={`text-sm text-[#21212B] capitalize`}>{userStatus}</p>
          </div>
        </div>
      </div>

      {/* Logout button */}
      {showLogout && (
        <button
          onClick={logout}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors group cursor-pointer"
          title="Cerrar sesión"
        >
          <IconLogout />
        </button>
      )}
    </div>
  );
}
