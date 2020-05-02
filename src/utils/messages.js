const generateMsg=(username,text)=>{
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMsg=(username,coords)=>{
    return {
        username,
        url: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
        createdAt: new Date().getTime()
    }
}

module.exports={
    generateMsg,
    generateLocationMsg
}