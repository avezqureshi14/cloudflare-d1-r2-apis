export type User = {
    username: string;
    display_name: string;
    media_url: string;
    title: string;
};

export const addUser = async (
    db: D1Database,
    user: User
) => {
    const query = `
      INSERT INTO users (username,display_name,media_url,title)
      VALUES (?, ?, ?, ?)`;

    const results = await db
        .prepare(query)
        .bind(user.username, user.display_name, user.media_url, user.title)
        .run();
    const savedUser = results;
    return savedUser;
};

export const getUsers = async (db: D1Database) => {
    const { results } = await db
        .prepare("SELECT * FROM users ORDER BY user_id ASC")
        .all();
    const users = results;
    return users;
}



