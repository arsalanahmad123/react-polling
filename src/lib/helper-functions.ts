import { type Poll } from "@/types";
export function isPollActive(poll: Poll): boolean {
    if (!poll.ends_at) return true;
    return new Date(poll.ends_at) > new Date();
}


export function getAnonId() {
    let anonId = localStorage.getItem('anon_id');
    if (!anonId) {
        anonId = crypto.randomUUID();
        localStorage.setItem('anon_id', anonId);
    }
    return anonId;
}
