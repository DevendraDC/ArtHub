import { SessionType } from "@/data/dal/getUserSession";

export const userAuthenticate = (session: SessionType) => {
    if(!session) return {
        status: false,
        message: "session not found"
    }
    if(!session?.user.name || !session.user.username) {
        return {
            status: false,
            message: "user has not created his profile"
        }
    }
    else return {
        status: true,
        message: "user is authenticated and has a profile",
        data: session
    }
}