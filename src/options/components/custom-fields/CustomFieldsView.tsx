import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { GetMessage } from "src/common/helpers";
import {
  createCustomField,
  deleteCustomField,
  saveCustomField,
  saveSortedCustomFields,
  MyThunkDispatch,
} from "src/options/actions";
import CustomFieldModal from "src/options/components/custom-fields/CustomFieldModal";
import CustomFieldsList from "src/options/components/custom-fields/CustomFieldsList";
import { ICustomField, ICustomFieldForm } from "src/types";

type Props = {
  profileIndex: number;
  customFields: ICustomField[];
};

export default function CustomFieldsView(props: Props): React.JSX.Element {
  const { profileIndex, customFields } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [customFieldIndex, setCustomFieldIndex] = useState(-1);
  const [customField, setCustomField] = useState<ICustomField | null>(null);
  const [actionType, setActionType] = useState<"create" | "edit" | undefined>();

  const dispatch = useDispatch<MyThunkDispatch>();

  // Every edition can add unlimited fields, to the default list and to URL-specific profiles.
  const allowAdd = true;
  const allowEdit = true;

  function closeModal(): void {
    setModalIsOpen(false);
    setCustomField(null);
    setActionType(undefined);
    setCustomFieldIndex(-1);
  }

  function newCustomField(index: number): void {
    if (allowEdit) {
      setCustomFieldIndex(index);
      setActionType("create");
      setCustomField(null);
      setModalIsOpen(true);
    }
  }

  function handleEdit(currentCustomField: ICustomField, index: number): void {
    if (allowEdit) {
      setCustomFieldIndex(index);
      setCustomField(currentCustomField);
      setActionType("edit");
      setModalIsOpen(true);
    }
  }

  function handleDelete(index: number): void {
    if (allowEdit) {
      if (window.confirm(GetMessage("customFields_delete_confirm_message"))) {
        dispatch(deleteCustomField(index, profileIndex));
      }
    }
  }

  function handleSort(sortedCustomFields: ICustomField[]): void {
    if (allowEdit) {
      dispatch(saveSortedCustomFields(sortedCustomFields, profileIndex));
    }
  }

  function handleSave(formValues: ICustomFieldForm): void {
    if (allowEdit) {
      if (actionType === "edit") {
        dispatch(saveCustomField(formValues, customFieldIndex, profileIndex));
      } else {
        dispatch(createCustomField(formValues, customFieldIndex, profileIndex));
      }
      closeModal();
    }
  }

  return (
    <>
      <CustomFieldsList
        customFields={customFields}
        allowAdd={allowAdd}
        allowEdit={allowEdit}
        onAdd={newCustomField}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
      />

      <CustomFieldModal isOpen={modalIsOpen} customField={customField} onClose={closeModal} onSave={handleSave} />
    </>
  );
}
