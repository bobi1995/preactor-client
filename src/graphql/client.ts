import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { graphqlEndpoint, endpoint } from "../../dbconfig";
import axios from "axios";
const httpLink = createHttpLink({ uri: graphqlEndpoint });
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
    },
    query: {
      fetchPolicy: "network-only",
    },
  },
});

export const uploadFile = async (file: File, id: string): Promise<void> => {
  const formData = new FormData();
  formData.append("picture", file); // Key must match the backend's `upload.single("picture")`
  formData.append("id", id);

  try {
    const response = await axios.post(`${endpoint}/upload/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload successful:", response.data);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
