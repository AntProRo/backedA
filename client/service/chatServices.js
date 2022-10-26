import { HttpService } from "./HttpService";

export const chatService = () => {
  const { post, get, put, deleteFn } = HttpService();

  const getDailyComment = (id) => {
    const url = `/api/getDailyComment/${id}`;
    return get(url, "getDailyComment", {});
  };

  const postDailyComment = (id, body) => {
    const url = `/api/postDailyComment/${id}`;
    return post(url, body, "postDailyComment", {});
  };

  const getChats = () => {
    const url = `/api/getChatRooms`;
    return get(url, "getChatRooms", {});
  };


  const postComments = (body) => {
    const url = `/api/postComment`;
    return post(url, body,"postComment", {});
  };
  return {
    getDailyComment,
    postDailyComment,
    postComments,
    getChats
  };
};
