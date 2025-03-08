
const STORIES_DB = 'stories.db'

import BetterSqlite3 from 'better-sqlite3';
const db = new BetterSqlite3(STORIES_DB, {});
db.prepare(`CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY,
        story TEXT,
        date TEXT
    );`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS mareSelections (
        id INTEGER PRIMARY KEY,
        mare_of_the_day TEXT,
        m6_of_the_week TEXT,
        mare_of_interest TEXT,
        date TEXT
    );`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS episodeSelections (
        id INTEGER PRIMARY KEY,
        s1_2 TEXT,
        s3_6 TEXT,
        s7_9 TEXT,
        date TEXT
    );`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY,
        author TEXT,
        title TEXT,
        review TEXT,
        selector_date TEXT
    );`).run();

export function getStories(datestr: string) {
    return db.prepare(`SELECT story FROM stories WHERE date = ?`).get(datestr);
}

export function getReviews(datestr: string) {
    return db.prepare(`SELECT author, title, review FROM reviews WHERE selector_date = ?`).all(datestr);
}

export function getMareSelections(datestr: string) {
    return db.prepare(`SELECT mare_of_the_day, m6_of_the_week, mare_of_interest FROM mareSelections WHERE date = ?`).get( datestr);
}

export function getEpisodeSelections(datestr: string) {
    return db.prepare(`SELECT s1_2, s3_6, s7_9 FROM episodeSelections WHERE date = ?`).get(datestr);
}

export function writeStory(story: string, datestr: string) {
    db.prepare(`INSERT INTO stories (story, date) VALUES (?, ?)`).run(story, datestr);
}

export function writeReview(author: string, title: string, review: string, datestr: string) {
    db.prepare(`INSERT INTO reviews (author, title, review, selector_date) VALUES (?, ?, ?, ?)`).run(author, title, review, datestr);
}

export function writeMareSelections(mare_of_the_day: string, m6_of_the_week: string, mare_of_interest: string, datestr: string) {
    db.prepare(`INSERT INTO mareSelections (mare_of_the_day, m6_of_the_week, mare_of_interest, date) VALUES (?, ?, ?, ?)`).run(mare_of_the_day, m6_of_the_week, mare_of_interest, datestr);
}

export function writeEpisodeSelections(s1_2: string, s3_6: string, s7_9: string, datestr: string) {
    db.prepare(`INSERT INTO episodeSelections (s1_2, s3_6, s7_9, date) VALUES (?, ?, ?, ?)`).run(s1_2, s3_6, s7_9, datestr);
}
