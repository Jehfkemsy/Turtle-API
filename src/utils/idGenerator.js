//will create a uniqueID of a specified length 
const createId = (N) => {
   return (Math.random().toString(36)+'00000000000000000').slice(2, N+2)
};

const createAvatar = () => {
   Math.floor((Math.random() * 7 + 1)
}

export default {createId};