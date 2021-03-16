//  import React, { useRef } from "react"
//  import { Link } from "react-router-dom";
//  import {Form} from "react-bootstrap"
//  import 'bootstrap/dist/css/bootstrap.min.css'
//  import "./Login.css"


// export const Login = props => {
//     const email = useRef()
//     const password = useRef()
//     const existDialog = useRef()
//     const passwordDialog = useRef()

//     const existingUserCheck = () => {
//          // If your json-server URL is different, please change it below!
//          return fetch(`http://localhost:8088/users?email=${email.current.value}`)
//              .then(_ => _.json())
//              .then(user => user.length ? user[0] : false)
//     }

//      const handleLogin = (e) => {
//          e.preventDefault()

//          existingUserCheck()
//              .then(exists => {
//                  if (exists && exists.password === password.current.value) {
//                      // The user id is saved under the key app_user_id in local Storage. Change below if needed!
//                      localStorage.setItem("app_user_id", exists.id)
//                     props.history.push("/")
//                 } else if (exists && exists.password !== password.current.value) {
//                     passwordDialog.current.showModal()
//                 } else if (!exists) {
//                     existDialog.current.showModal()
//                 }
//             })
//     }

//     return (
//         <main className="container--login">
//             <dialog className="dialog dialog--auth" ref={existDialog}>
//                 <div>User does not exist</div>
//                 <button className="button--close" onClick={e => existDialog.current.close()}>Close</button>
//             </dialog>
//             <dialog className="dialog dialog--password" ref={passwordDialog}>
//                 <div>Password does not match</div>
//                 <button className="button--close" onClick={e => passwordDialog.current.close()}>Close</button>
//             </dialog>
//             <section>
//                 <Form className="form--login" onSubmit={handleLogin}>
//                     <h1>Bourbon.log()</h1>
//                     <h2>Please sign in</h2>
//                     <fieldset>
//                         <label htmlFor="inputEmail"> Email address </label>
//                         <input ref={email} type="email"
//                             id="email"
//                             className="form-control"
//                             placeholder="Email address"
//                             required autoFocus />
//                     </fieldset>
//                     <fieldset>
//                         <label htmlFor="inputPassword"> Password </label>
//                         <input ref={password} type="password"
//                             id="password"
//                             className="form-control"
//                             placeholder="Password"
//                             required />
//                     </fieldset>
//                     <fieldset>
//                         <button type="submit">
//                             Sign in
//                         </button>
//                     </fieldset>
//                 </Form>
//             </section>
//             <section className="link--register">
//                 <Link to="/register">Logging in for the first time?</Link>
//             </section>
//         </main>
//     )
// }


import React, { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
// import "./Auth.css";

export const Login = () => {

  const email = useRef();
  const password = useRef();
  const invalidDialog = useRef();
  const history = useHistory();

  const handleLogin = (e) => {
    e.preventDefault();
    
    return fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: email.current.value,
        password: password.current.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if ("valid" in res && res.valid) {
          localStorage.setItem("app_user", res.token);
          console.log(res)
          history.push("/");
        } else {
          invalidDialog.current.showModal();
        }
      });
  };
  return (
    <main className="container--login">
      <dialog className="dialog dialog--auth" ref={invalidDialog}>
        <div>Email or password was not valid.</div>
        <button
          className="button--close"
          onClick={(e) => invalidDialog.current.close()}
        >
          Close
        </button>
      </dialog>
      <section>
        <form className="form--login" onSubmit={handleLogin}>
          <h1>BourbonLog V2</h1>
          <h2>Please sign in</h2>
          <fieldset>
            <label htmlFor="inputEmail"> Email address </label>
            <input
              ref={email}
              type="email"
              id="email"
              className="form-control"
              defaultValue="test@test.com"
              placeholder="Email address"
              required
              autoFocus
            />
          </fieldset>
          <fieldset>
            <label htmlFor="inputPassword"> Password </label>
            <input
              ref={password}
              type="password"
              id="password"
              className="form-control"
              defaultValue="test"
              placeholder="Password"
              required
            />
          </fieldset>
          <fieldset
            style={{
              textAlign: "center",
            }}
          >
            <button className="btn btn-1 btn-sep icon-send" type="submit">
              Sign In
            </button>
          </fieldset>
        </form>
      </section>
      <section className="link--register">
        <Link to="/register">Not a member yet?</Link>
      </section>
    </main>
  );
};
