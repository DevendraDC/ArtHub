import Image from "next/image";
import Link from "next/link";

type UserInfo = {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
};

type Props = {
    users: UserInfo[];
    emptyMessage: string;
};

function UserCard({ user }: { user: UserInfo }) {
    return (
        <Link href={`/user/${user.username}`}>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all duration-150 cursor-pointer group">
                <div className="flex items-center gap-3">
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={user.name ?? ""}
                            width={42}
                            height={42}
                            className="rounded-full border border-(--amber)"
                        />
                    ) : (
                        <div className="w-10.5 h-10.5 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-sm font-serif">
                            {user.name?.[0] ?? "?"}
                        </div>
                    )}
                    <div>
                        <div className="font-serif text-sm tracking-wide">{user.name}</div>
                        <div className="text-xs text-(--text-subtle)">@{user.username}</div>
                    </div>
                </div>
                <div className="text-xs text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    View →
                </div>
            </div>
        </Link>
    );
}

export default function FollowList({ users, emptyMessage }: Props) {
    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-(--text-muted) gap-2">
                <div className="text-3xl">—</div>
                <div className="text-sm">{emptyMessage}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col divide-y divide-white/5">
            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    );
}