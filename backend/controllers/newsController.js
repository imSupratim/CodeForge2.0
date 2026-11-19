import axios from "axios";

export const getNews = async(req, res)=>{
    try {
    const response = await axios.get(
      "https://dev.to/api/articles",
      {
        params: {
          per_page: 30,
          top: 30,
        },
      }
    )
    res.json(response.data)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dev news" })
  }
}