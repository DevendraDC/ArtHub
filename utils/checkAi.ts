"use server";

export const checkAi = async (img: string) => {
  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WINSTON_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: img, version: "3" }),
    };
    const res = await fetch(
      "https://api.gowinston.ai/v2/image-detection",
      options,
    );
    const data = await res.json();
    const score = data.score;
    if (score >= 0 && score <= 10) {
      return {
        success: true,
        result: {
            aiGenerated: true
        }
      };
    }
    return {
        success: true,
        result: {
            aiGenerated: false
        }
    }
  } catch (error) {
    console.error("error while checking for ai generated", error);
    return {
      success: false,
      result: null
    };
  }
};
