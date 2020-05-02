const users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //if either empty
    if (!username || !room) {
        return {
            error: "Please enter username and room"
        }
    }

    //validate existing user
    const existing = users.find((user) => {
        return user.username === username
    })

    if (existing) {
        return {
            error: "username already exists!"
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if (index !== -1) {
        return users.splice(index, 1)[0] //returns an array of objects at that index
        //1 for hardcoding it to return only 1 object
        //[0] for accessing the first object of the array
        //splice method changes the original array
    }
}

const getUser = (id) => {
    return users.find((user) => {
        return user.id === id
    })
}

const getUsersInRoom = (room) => {
    return users.filter((user)=>{
        return user.room==room
    })
}

/*addUser({
    id: 1,
    username: "adil",
    room: "bhavnagar"
})

addUser({
    id: 2,
    username: "darsh",
    room: "bhavnagar"
})

addUser({
    id: 3,
    username: "himanshu",
    room: "ahmedabad"
})

addUser({
    id: 4,
    username: "meet",
    room: "ahmedabad"
})
console.log(getUser(2))
var userList=getUsersInRoom('bhavnagar')
console.log(userList)*/

module.exports={
    addUser,
    getUser,
    removeUser,
    getUsersInRoom
}
