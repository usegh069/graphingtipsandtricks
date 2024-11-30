class Leaderboard {
    constructor(gameID, client) {
        this.gameID = gameID;
        this.client = client;
        this.cached = [];
        this.loading = false;
        this.needsRefresh = false;
        this.score = 0;
    }
    async loadScores(showUserRank) {
        if (this.loading) {
            return this.cached;
        }
        if (this.cached.length > 0 && !this.needsRefresh) {
            return this.cached;
        }

        this.loading = true;
        const { data, error } = await this.client
            .from('leaderboard')
            .select(`score, u_profiles (id, display_name)`)
            .eq('game_id', this.gameID)
            .order('score', { ascending: false })
            .limit(10);

        if (error) {
            log(error);
            console.error(error);
        }
        this.loading = false;
        var rp = false;
        var scores = data.map((row) => {
            if (row.u_profiles.id == 'guest' || row.u_profiles.id == window.ccPorted?.user?.id) {
                rp = true;
            }
            return {
                score: row.score,
                id: row.u_profiles.id,
                display_name: row.u_profiles.display_name
            }

        });
        if (this.guestScore != undefined) {
            scores.push({ score: this.guestScore, display_name: 'Guest', id: 'guest' });
            scores.sort((a, b) => b.score - a.score);
        }
        if (showUserRank && !rp) {
            const { data: rank } = await this.client
                .rpc('get_lowest_rank', { p_game_id: this.gameID, p_user_id: window.ccPorted?.user?.id });
            if (rank) {
                scores.push({ score: this.score.score, display_name: this.score.display_name, id: this.score.id, rank: rank });
                scores.sort((a, b) => b.score - a.score);
            }
        }
        this.cached = scores;
        this.needsRefresh = false;
        return scores;
    }
    addGuestScore(score) {
        this.guestScore = score;
        if (this.cached.length > 0) {
            this.cached.push({ score: score, u_profiles: { display_name: 'Guest', id: 'guest' } });
            this.cached.sort((a, b) => b.score - a.score);
        }
    }
    async addScore(userID, score) {
        log("adding score");
        try {
            // find old score
            const { data: oldScore, error: oldError } = await this.client
                .from('leaderboard')
                .select(`score, id, u_profiles (display_name)`)
                .eq('user_id', userID)
                .eq('game_id', this.gameID);
            if (oldError) {
                log(oldError);
                console.error(oldError);
            }
            // update score if new score is higher
            if (oldScore && oldScore.length > 0) {
                if (oldScore[0].score >= score) {
                    this.score = { score: score, id: userID, display_name: window.ccPorted?.user?.user_metadata.display_name || "Anonymous" };
                    return;
                }
            }
            const newData = { game_id: this.gameID, user_id: userID, score: score };
            if (oldScore && oldScore.length > 0) {
                newData.id = oldScore[0].id;
            }
            const { error } = await this.client
                .from('leaderboard')
                .upsert(newData);
            if (error) {
                log(error);
                console.error(error);
            }
            this.needsRefresh = true;
        } catch (e) {
            console.error(e);
            log(e);
        }
    }
    clearCache() {
        this.cached = [];
    }
}
