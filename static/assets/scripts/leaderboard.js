class Leaderboard{
    constructor(gameID, client){
        this.gameID = gameID;
        this.client = client;
        this.cached = [];
        this.loading = false;
    }
    async loadScores() {
        if(this.loading){
            return this.cached;
        }
        if(this.cached.length > 0){
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
            alert(error);
            console.error(error);
        }
        this.loading = false;

        const scores = [...data];
        if(this.guestScore != undefined){
            scores.push({score: this.guestScore, u_profiles: {display_name: 'Guest', id: 'guest'}});
            scores.sort((a, b) => b.score - a.score);
        }
        this.cached = scores;
        return scores;
    }
    addGuestScore(score){
        this.guestScore = score;
        if(this.cached.length > 0){
            this.cached.push({score: score, u_profiles: {display_name: 'Guest', id: 'guest'}});
            this.cached.sort((a, b) => b.score - a.score);
        }
    }
    async addScore(userID, score){
        // find old score
        const { data: oldScore, error: oldError } = await this.client
            .from('leaderboard')
            .select(`score, id`)
            .eq('user_id', userID)
            .eq('game_id', this.gameID);
        if (oldError) {
            alert(oldError);
            console.error(oldError);
        }
        // update score if new score is higher
        if(oldScore && oldScore.length > 0){
            if(oldScore[0].score >= score){
                return;
            }
        }
        const newData = { game_id: this.gameID, user_id: userID, score: score };
        if(oldScore && oldScore.length > 0){
            newData.id = oldScore[0].id;
        }
        const { error } = await this.client
            .from('leaderboard')
            .upsert(newData);
        if (error) {
            alert(error);
            console.error(error);
        }
    }
}
