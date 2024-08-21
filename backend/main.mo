import Func "mo:base/Func";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Time "mo:base/Time";
import List "mo:base/List";
import Int "mo:base/Int";

actor {
  // Define the Post type
  public type Post = {
    title: Text;
    body: Text;
    author: Text;
    timestamp: Int;
  };

  // Stable variable to store posts
  stable var posts : List.List<Post> = List.nil();

  // Function to create a new post
  public func createPost(title: Text, body: Text, author: Text) : async () {
    let newPost : Post = {
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := List.push(newPost, posts);
  };

  // Function to get all posts, sorted by recency
  public query func getPosts() : async [Post] {
    let sortedPosts = List.toArray(posts);
    Array.sort(sortedPosts, func(a: Post, b: Post) : { #less; #equal; #greater } {
      Int.compare(b.timestamp, a.timestamp)
    })
  };
}
