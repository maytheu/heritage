import React, { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class MyEditor extends Component {
  
  render() {
    return (
      <div>
        <Editor
          editorState={this.props.editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="editer-content"
          onEditorStateChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default MyEditor;
