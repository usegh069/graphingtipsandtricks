const client = window.ccSupaClient;

async function init(){
    const { data, error } = await client
        .from('cc_status')
        .select('*')
    data.forEach(piece=>{
        const { name, status, tags } = piece;
        
    })
}

const gameTagMap