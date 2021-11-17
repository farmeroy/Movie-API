<h1>Movie API</h1>
This is a Rest API made with Node.js that will:
<ul>
<li>provide a list of movies with information about genre/director/etc.</li>
<li> users to create, update, and delete an account</li>
<li> users to create a list of their favorite movies from the database</li>
</ul>

<table>
    <thead>
      <tr>
        <th>Business Logic</th>
        <th>URL</th>
        <th>HTTP Method</th>
        <th>Request Body Data Format</th>
        <th>Response Body Data Format</th>
      </tr>
    <thead>
    <tbody>
        <tr>
          <td>Return a list of all movies</td>
          <td>/movies</td>                         
          <td>GET</td>                         
          <td>None</td>                         
          <td>JSON object contain all movie data</td>                 
        </tr>
        <tr>
          <td>Return data about a single movie (by title)</td>
          <td>/movies/[title]</td>                         
          <td>GET</td>                         
          <td>None</td>                         
          <td>JSON object containing the data abou the requested movie.</td>                         
        </tr>
        <tr>
          <td>Return the genre of a movie (by title)</td>
          <td>/movies/[title]/genre</td>                         
          <td>GET</td>                         
          <td>None</td>                         
          <td>A text message with the movie name and genre.</td>                         
        </tr>
        <tr>
          <td>Return a list of all the directors in the database</td>
          <td>/directors</td>                         
          <td>GET</td>                         
          <td>None</td>                         
          <td>JSON object containing data about all the directors.</td>                         
        </tr>
        <tr>
          <td>Return data about a single director (by name)</td>
          <td>/directors/[name]</td>                         
          <td>GET</td>                         
          <td>None</td>                         
          <td>JSON obect containing data about the director.</td>                         
        </tr>
        <tr>
          <td>Register new User</td>
          <td>/users</td>                         
          <td>POST</td>                         
          <td>JSON object should look like this:
              {
                username: “foo89”,
                email: “email@email.com”
              }
          </td>                         

          <td>JSON object returned<br>
            {id: 666, username: "foo89", email: "email@email.com"}</td>                         
        </tr>
        <tr>
          <td>Update user name</td>
          <td>/users/[username]</td>                         
          <td>PUT</td>                         
          <td>JSON object formatted like this: 
            <br>{ newUsername: "foo90", 
                  id: [matching id]}</td>                         
          <td>Text message: 'User "foo89" is now "foo90".'</td>                         
        </tr>
        <tr>
          <td>Delete User Account</td>
          <td>/users/[username]</td>                         
          <td>DELETE</td>                         
          <td>JSON Object containing: 
            <br>{ username: "Testname666",
                  id: [matching id]
                }</td>                         
          <td>Text confirmation that the user account was deleted</td>                         
        </tr>
        <tr>
          <td>Add film to User's movie list</td>
          <td>/users/[username]/movies</td>                         
          <td>PUT</td>                         
          <td>JSON object: { title: "Film Title" }</td>                         
          <td>Text confirmation that the title was added</td>                         
        </tr>
        <tr>
          <td>Remove a film from the User's film list</td>
          <td>/users/[username]/movies</td>                         
          <td>DELETE</td>                         
          <td>JSON Object containing:
            <br>{ title: "title" }</td>                         
          <td>Text confirmation that the movie was deleted</td>                         
        </tr>
  </table>

