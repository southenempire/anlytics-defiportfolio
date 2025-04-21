// src/fs-mock.js
export const promises = {
    readFile: async () => { throw new Error('fs.readFile not supported in browser'); },
    writeFile: async () => { throw new Error('fs.writeFile not supported in browser'); },
    stat: async () => { throw new Error('fs.stat not supported in browser'); },
  };
  export const statSync = () => { throw new Error('fs.statSync not supported in browser'); };
  export const createReadStream = () => { throw new Error('fs.createReadStream not supported in browser'); };
  export default promises;