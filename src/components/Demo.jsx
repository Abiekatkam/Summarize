import { useState, useEffect } from "react";

import { copy, linkIcon, loader, tick } from "../assets";

import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [articles, setArticles] = useState({
    url: "",
    summary: "",
  });
  const [copyUrl, setCopyUrl] = useState("");

  const [allArticles, setAllArticles] = useState([]);

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: articles.url });

    if (data?.summary) {
      const newArticle = { ...articles, summary: data.summary };
      const updateAllArticles = [newArticle, ...allArticles];

      setArticles(newArticle);
      setAllArticles(updateAllArticles);

      localStorage.setItem("articles", JSON.stringify(updateAllArticles));
    }
  };

  const handleCopy = (copyUrl) => {
    setCopyUrl(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => {
      setCopyUrl("");
    }, 3000);
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* search */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-3"
          />
          <input
            type="url"
            placeholder="Enter a url here"
            value={articles.url}
            onChange={(e) => {
              setArticles({ ...articles, url: e.target.value });
            }}
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            <p>↵</p>
          </button>
        </form>

        {/* Browser history  */}
        <div className="flex flex-col gap-1 max-h-60  overflow-y-auto">
          {allArticles.map((article, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticles(article)}
              className="link_card"
            >
              <div className="copy_btn">
                <img
                  src={copyUrl === article.url ? tick : copy}
                  alt="copy_btn"
                  className="w-[40%] h-[40%] object-contain"
                  onClick={() => {
                    handleCopy(article.url);
                  }}
                />
              </div>
              <p className="flex-1 font-medium font-satoshi text-blue-700 text-sm truncate">
                {article.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Display result */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-bold font-inter text-black text-center">
            Well this is embarrassing, something went wrong. Please try again.
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          articles.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>

              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {articles.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
