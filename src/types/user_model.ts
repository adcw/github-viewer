export default interface UserModel {
    id: number,
    login: string,
    name: string,
    avatar_url: string,
    email: string

    created_at: string,

    bio: string

    html_url: string,

    followers_url: string,
    following_url: string,
    repos_url: string,

    public_repos: string,
}