export default interface RepoModel {
    id: number,
    name: string,
    html_url: string,

    stargazers_count: number,
    stargazers_url: string,
    
    created_at: string
}