/* global $ */
/* eslint consistent-return: "off", no-console: "off" */

$(document).ready(() => {
  const apiUrl = 'https://usmanlive.com/wp-json/api/stories';

  // Load all stories
  function loadStories() {
    $.get(apiUrl, (data) => {
      $('#storyTableBody').empty();
      data.forEach((story) => {
        $('#storyTableBody').append(`
          <tr>
            <td>${story.id}</td>
            <td>${story.title}</td>
            <td>${story.content}</td>
            <td>
              <button onclick="editStory(${story.id}, '${story.title}', '${story.content}')">Edit</button>
              <button onclick="deleteStory(${story.id})">Delete</button>
            </td>
          </tr>
        `);
      });
    });
  }

  // Reset form
  function resetForm() {
    $('#storyId').val('');
    $('#storyTitle').val('');
    $('#storyContent').val('');
  }

  // Add or Update story
  $('#saveStory').on('click', () => {
    const id = $('#storyId').val();
    const title = $('#storyTitle').val().trim();
    const content = $('#storyContent').val().trim();

    if (!title || !content) {
      console.warn('Title and content are required.');
      return;
    }

    const storyData = { title, content };

    if (id) {
      // Update story
      $.ajax({
        url: `${apiUrl}/${id}`,
        type: 'PUT',
        data: JSON.stringify(storyData),
        contentType: 'application/json',
        success() {
          console.log('Story updated successfully');
          resetForm();
          loadStories();
        },
      });
    } else {
      // Add new story
      $.post({
        url: apiUrl,
        data: JSON.stringify(storyData),
        contentType: 'application/json',
        success() {
          console.log('Story added successfully');
          resetForm();
          loadStories();
        },
      });
    }
  });

  // Edit story
  window.editStory = function (id, title, content) {
    $('#storyId').val(id);
    $('#storyTitle').val(title);
    $('#storyContent').val(content);
  };

  // Delete story
  window.deleteStory = function (id) {
    if (window.confirm('Are you sure you want to delete this story?')) {
      $.ajax({
        url: `${apiUrl}/${id}`,
        type: 'DELETE',
        success() {
          console.log('Story deleted successfully');
          loadStories();
        },
      });
    }
  };

  // Initial load of stories
  $('#loadStories').on('click', () => {
    loadStories();
  });
});