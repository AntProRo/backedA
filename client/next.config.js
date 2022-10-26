const onLine =
  "http://localhost:5000/api"; /* 'https://a-project-production.up.railway.app/api' */

module.exports = {
  reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com"],
  },
  async rewrites() {
    return [
      /* Image */
      {
        source: "/api/upload",
        destination: `${onLine}/upload`,
      },
      {
        source: "/api/destroy",
        destination: `${onLine}/destroy`,
      },
      {
        source: "/api/register",
        destination: `${onLine}/register`,
      },
      {
        source: "/api/refresh_token",
        destination: `${onLine}/refresh_token`,
      },
      {
        source: "/api/login",
        destination: `${onLine}/login`,
      },
      {
        source: "/api/logout",
        destination: `${onLine}/logout`,
      },
      {
        source: "/api/role",
        destination: `${onLine}/role`,
      },
      {
        source: "/api/newPassword",
        destination: `${onLine}/newPassword`,
      },
      {
        source: "/api/info",
        destination: `${onLine}/info`,
      },
      /* Admin */
      {
        source: "/api/registerNewUser",
        destination: `${onLine}/registerNewUser`,
      },
      {
        source: "/api/getAllUser",
        destination: `${onLine}/getAllUser`,
      },
      {
        source: "/api/deleteUserAccount/:id",
        destination: `${onLine}/deleteUserAccount/:id`,
      },
      {
        source: "/api/updateAccount/:id",
        destination: `${onLine}/updateAccount/:id`,
      },
      {
        source: "/api/deleteUserAccountManager/:id",
        destination:`${onLine}/deleteUserAccountManager/:id`
      },
      /* Collaborator */
      {
        source: "/api/getCollaboratorInfo/:id",
        destination: `${onLine}/getCollaboratorInfo/:id`,
      },
      /* Task */
      {
        source: "/api/newTask",
        destination: `${onLine}/newTask`,
      },
      {
        source: "/api/getTask/:id",
        destination: `${onLine}/getTask/:id`,
      },
      {
        source: "/api/updateTask/:id",
        destination: `${onLine}/updateTask/:id`,
      },
      {
        source: "/api/deleteTask/:id",
        destination: `${onLine}/deleteTask/:id`,
      },
      /* Client */
      {
        source: "/api/newTechLead",
        destination: `${onLine}/newTechLead`,
      },
      {
        source: "/api/getTechLead/:id",
        destination: `${onLine}/getTechLead/:id`,
      },
      {
        source: "/api/updateTechLead/:id",
        destination: `${onLine}/updateTechLead/:id`,
      },
      {
        source: "/api/deleteTechLead/:id",
        destination: `${onLine}/deleteTechLead/:id`,
      },
      {
        source: "/api/newManager",
        destination: `${onLine}/newManager`,
      },
      {
        source: "/api/getManager/:id",
        destination: `${onLine}/getManager/:id`,
      },
      {
        source: "/api/updateManager/:id",
        destination: `${onLine}/updateManager/:id`,
      },
      {
        source: "/api/deleteManager/:id",
        destination: `${onLine}/deleteManager/:id`,
      },
      {
        source: "/api/newClient",
        destination: `${onLine}/newClient`,
      },
      {
        source: "/api/getClient",
        destination: `${onLine}/getClient`,
      },
      {
        source: "/api/updateClient/:id",
        destination: `${onLine}/updateClient/:id`,
      },
      {
        source: "/api/deleteClient/:id",
        destination: `${onLine}/deleteClient/:id`,
      },
      {
        source: "/api/deleteClient/:id",
        destination: `${onLine}/deleteClient/:id`,
      },
      /* Daily */
      {
        source: "/api/getDailyComment/:id",
        destination: `${onLine}/getDailyComment/:id`,
      },
      {
        source: "/api/postDailyComment/:id",
        destination: `${onLine}/postDailyComment/:id`,
      },
      /* CHATS */
      {
        source: "/api/getChatRooms",
        destination: `${onLine}/getChatRooms`,
      },
      {
        source: "/api/postComment",
        destination: `${onLine}/postComment`,
      },
      /* User Not Added*/
      {
        source: "/api/getAllUserNotAdded",
        destination: `${onLine}/getAllUserNotAdded`,
      }, {
        source: "/api/addNewUserToMyList/:id",
        destination: `${onLine}/addNewUserToMyList/:id`,
      }
    ];
  },
};
