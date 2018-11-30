$(document).ready(function() {
  // Getting jQuery references to the post body, title, form, and author select
  var descriptionInput = $("#post-description");
  var titleInput = $("#post-name");
  var postForm = $("#post-form");
  var departmentSelect = $("#department");
  // Adding an event listener for when the form is submitted
  $(postForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a post)
  var url = window.location.search;
  var postId;
  var departmentId;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the post id from the url
  // In '?post_id=1', postId is 1
  if (url.indexOf("?post_id=") !== -1) {
    postId = url.split("=")[1];
    getPostData(postId, "post");
  }
  // Otherwise if we have an author_id in our url, preset the author select box to be our Author
  else if (url.indexOf("?author_id=") !== -1) {
    departmentId = url.split("=")[1];
  }

  // Getting the authors, and their posts
  getDepartments();

  // A function for handling what happens when the form to create a new post is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a body, title, or author
    if (!titleInput.val().trim() || !descriptionInput.val().trim() || !departmentSelect.val()) {
      return;
    }
    // Constructing a newPost object to hand to the database
    var newPost = {
      title: titleInput
        .val()
        .trim(),
      body: descriptionInput
        .val()
        .trim(),
      DepartmentId: departmentSelect.val()
    };

    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updating) {
      newPost.id = postId;
      updatePost(newPost);
    }
    else {
      submitPost(newPost);
    }
  }

  // Submits a new post and brings user to blog page upon completion
  function submitPost(post) {
    $.post("/api/posts", post, function() {
      window.location.href = "/departments";
    });
  }

  // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
  function getPostData(id, type) {
    var queryUrl;
    switch (type) {
    case "post":
      queryUrl = "/api/posts/" + id;
      break;
    case "department":
      queryUrl = "/api/department/" + id;
      break;
    default:
      return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.DepartmentId || data.id);
        // If this post exists, prefill our cms forms with its data
        titleInput.val(data.title);
        descriptionInput.val(data.body);
        departmentId = data.DepartmentId || data.id;
        // If we have a post with this id, set a flag for us to know to update the post
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get Authors and then render our list of Authors
  function getDepartments() {
    $.get("/api/departments", renderDepartmentList);
  }
  // Function to either render a list of authors, or if there are none, direct the user to the page
  // to create an author first
  function renderDepartmentList(data) {
    if (!data.length) {
      window.location.href = "/departments";
    }
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createDepartmentRow(data[i]));
    }
    departmentSelect.empty();
    console.log(rowsToAdd);
    console.log(departmentSelect);
    departmentSelect.append(rowsToAdd);
    departmentSelect.val(departmentId);
  }

  // Creates the author options in the dropdown
  function createDepartmentRow(author) {
    var listOption = $("<option>");
    listOption.attr("value", department.id);
    listOption.text(department.text);
    return listOption;
  }

  // Update a given post, bring user to the blog page when done
  function updatePost(post) {
    $.ajax({
      method: "PUT",
      url: "/api/createpost",
      data: post
    })
      .then(function() {
        window.location.href = "/departments";
      });
  }
});
