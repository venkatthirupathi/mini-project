// // import 'codemirror/theme/monokai.css'

// // import React, { useEffect, useRef } from 'react';
// // import Codemirror from 'codemirror';
// // import 'codemirror/lib/codemirror.css';
// // import 'codemirror/theme/dracula.css';
// // import 'codemirror/mode/javascript/javascript';
// // import 'codemirror/addon/edit/closetag';
// // import 'codemirror/addon/edit/closebrackets';
// // import ACTIONS from '../Actions';


// // const Editor = ({ socketRef, roomId, onCodeChange }) => {
// //     const editorRef = useRef(null);
// //     useEffect(() => {
// //         async function init() {
// //             editorRef.current = Codemirror.fromTextArea(
// //                 document.getElementById('realtimeEditor'),
// //                 {
// //                     mode: { name: 'javascript', json: true },
// //                     theme: 'dracula',
// //                         theme : 'monokai',
// //                     autoCloseTags: true,
// //                     autoCloseBrackets: true,
// //                     lineNumbers: true,
// //                 }
// //             );

// //             editorRef.current.on('change', (instance, changes) => {
// //                 const { origin } = changes;
// //                 const code = instance.getValue();
// //                 onCodeChange(code);
// //                 if (origin !== 'setValue') {
// //                     socketRef.current.emit(ACTIONS.CODE_CHANGE, {
// //                         roomId,
// //                         code,
// //                     });
// //                 }
// //             });
// //         }
// //         init();
// //     }, []);

// //     useEffect(() => {
// //         if (socketRef.current) {
// //             socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
// //                 if (code !== null) {
// //                     editorRef.current.setValue(code);
// //                 }
// //             });
// //         }

// //         return () => {
// //             socketRef.current.off(ACTIONS.CODE_CHANGE);
// //         };
// //     }, [socketRef.current]);

// //     return <textarea id="realtimeEditor"></textarea>;
// // };

// // export default Editor;

// // Editor.js
import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

// Import your custom theme
// import './custom-theme.css';
import './Editor.css';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realtimeEditor'),
        {
          mode: { name: 'javascript', json: true },
          theme: 'default', // using default and overriding with custom CSS
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on('change', (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }

    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;



// import React, { useEffect, useRef } from 'react';
// import Codemirror from 'codemirror';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/addon/edit/closetag';
// import 'codemirror/addon/edit/closebrackets';
// import ACTIONS from '../Actions';

// // Import your custom theme if needed
// import './Editor.css'; // Ensure this CSS contains your custom theme definitions

// const Editor = ({ socketRef, roomId, onCodeChange }) => {
//   const editorRef = useRef(null);

//   useEffect(() => {
//     // Initialize CodeMirror instance
//     const initEditor = () => {
//       editorRef.current = Codemirror.fromTextArea(
//         document.getElementById('realtimeEditor'),
//         {
//           mode: { name: 'javascript', json: true },
//           theme: 'monokai', // Change this to your desired theme
//           autoCloseTags: true,
//           autoCloseBrackets: true,
//           lineNumbers: true,
//         }
//       );

//       // Handle code changes and emit to socket
//       editorRef.current.on('change', (instance, changes) => {
//         const { origin } = changes;
//         const code = instance.getValue();
//         onCodeChange(code);
//         if (origin !== 'setValue') {
//           socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//             roomId,
//             code,
//           });
//         }
//       });
//     };

//     initEditor();

//     // Cleanup on component unmount
//     return () => {
//       if (editorRef.current) {
//         editorRef.current.toTextArea();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     // Listen for code changes from other users and update the editor
//     if (socketRef.current) {
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (code !== null) {
//           editorRef.current.setValue(code);
//         }
//       });
//     }

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off(ACTIONS.CODE_CHANGE);
//       }
//     };
//   }, [socketRef.current]);

//   return <textarea id="realtimeEditor"></textarea>;
// };

// export default Editor;

