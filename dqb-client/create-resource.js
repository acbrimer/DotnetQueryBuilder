/**
 * create-resource
 * Args:
 *  - ResourceName
 *  - Plural name (optional)
 *
 */
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

// function getResDirName(key) {
//   const result = key.replace(/([A-Z])/g, " $1");
//   const dirName = result.split(" ").join("_").toLowerCase();
//   if (dirName[0] === "_") {
//     return dirName.substring(1) + 's';
//   }
//   return dirName + 's';
// }

function getResDirName(resPlural) {
  return resPlural.split(" ").join("_").toLowerCase();
}

const resource_create = (resName, resPlural) => `
// src/resources/${getResDirName(resPlural)}/${resName}Create.tsx
import * as React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  required,
} from "react-admin";

const ${resName}Create = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="id" validate={[required()]} fullWidth />
      </SimpleForm>
    </Create>
  );
};

export default ${resName}Create;

`;

const resource_edit = (resName, resPlural) => `
// src/resources/${getResDirName(resPlural)}/${resName}Edit.tsx
import * as React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  ReferenceManyField,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  required,
} from "react-admin";

const ${resName}Edit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="id" />
      </SimpleForm>
    </Edit>
  );
};

export default ${resName}Edit;

`;

const resource_list = (resName, resPlural) => `
// src/resources/${getResDirName(resPlural)}/${resPlural}List.tsx
import * as React from "react";
import {
  ArrayField,
  BooleanField,
  ChipField,
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  SingleFieldList,
  TextField,
} from "react-admin";

const ${resPlural}List = () => {
  return (
    <List>
      <Datagrid></Datagrid>
    </List>
  );
};

export default ${resPlural}List;

`;

const resource_show = (resName, resPlural) => `
// src/resources/${getResDirName(resPlural)}/${resName}Show.tsx
import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  RichTextField,
} from "react-admin";

const ${resName}Show = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" />
      </SimpleShowLayout>
    </Show>
  );
};

export default ${resName}Show;


`;

const resource_index = (resName, resPlural) => `
// src/resources/${getResDirName(resPlural)}/index.ts
import ${resName}Create from "./${resName}Create";
import ${resPlural}List from "./${resPlural}List";
import ${resName}Edit from "./${resName}Edit";
import ${resName}Show from "./${resName}Show";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: ${resPlural}List,
  create: ${resName}Create,
  edit: ${resName}Edit,
  show: ${resName}Show,
};

`;

if (args.length > 0) {
  const resName = args[0];
  const resPlural = args[1] || resName + "s";
  const resRootDir = path.join(__dirname, "/src", "/resources");
  const resDir = path.join(resRootDir, getResDirName(resPlural));
  if (fs.existsSync(resDir)) {
    console.log(`Resource '${resName}' already exists!`);
  } else {
    console.log(`Creating resource '${resName}' at ${resDir}...`);
    fs.mkdirSync(resDir);
    const resCreatePath = path.join(resDir, `${resName}Create.tsx`);
    const resEditPath = path.join(resDir, `${resName}Edit.tsx`);
    const resListPath = path.join(resDir, `${resPlural}List.tsx`);
    const resShowPath = path.join(resDir, `${resName}Show.tsx`);
    const resIndexPath = path.join(resDir, `index.ts`);

    fs.writeFileSync(resCreatePath, resource_create(resName, resPlural));
    fs.writeFileSync(resEditPath, resource_edit(resName, resPlural));
    fs.writeFileSync(resShowPath, resource_show(resName, resPlural));
    fs.writeFileSync(resListPath, resource_list(resName, resPlural));
    fs.writeFileSync(resIndexPath, resource_index(resName, resPlural));
  }
}
