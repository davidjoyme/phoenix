import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { css } from "@emotion/react";

import {
  Button,
  FieldError,
  Flex,
  Form,
  Input,
  Label,
  Text,
  TextArea,
  TextField,
  View,
} from "@phoenix/components";
export type AnnotationFormData = {
  name: string;
  score?: number | null;
  label?: string | null;
  explanation?: string | null;
};

const detailsCSS = css`
  color: var(--ac-global-text-color-900);
  font-size: 12px;
`;
export type SpanAnnotationFormProps = {
  /**
   * The initial data to populate the form with
   */
  initialData: AnnotationFormData;
  /**
   * Whether the form is read only
   */
  isReadOnly?: boolean;
  /**
   * Callback to call when the form is submitted
   */
  onSubmit?: (data: AnnotationFormData) => void;
  /**
   * Whether or not the form is being submitted
   * @default false
   */
  isSubmitting?: boolean;
};
/**
 * A form to create or edit a span annotation
 */
export function SpanAnnotationForm(props: SpanAnnotationFormProps) {
  const { initialData, isReadOnly, onSubmit, isSubmitting = false } = props;

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    setError,
    reset,
  } = useForm({
    defaultValues: initialData,
    disabled: isReadOnly,
  });

  // Internal onSubmit that performs validation
  const _onSubmit = useCallback(
    (data: AnnotationFormData) => {
      const hasNoLabel = !data.label;
      const hasNoScore =
        (data.score as unknown as string) === "" || data.score == null;
      if (hasNoLabel && hasNoScore) {
        setError("label", {
          type: "manual",
          message: "Label or score is required",
        });
        setError("score", {
          type: "manual",
          message: "Label or score is required",
        });
        return;
      }
      const newData = {
        ...data,
        score: data.score != null ? parseFloat(data.score.toString()) : null,
      };
      onSubmit && onSubmit(newData);
      // Optimistically reset the form
      reset(newData);
    },
    [onSubmit, setError, reset]
  );

  const defaultDetailsCollapsed = !initialData.explanation;
  return (
    <Form onSubmit={handleSubmit(_onSubmit)}>
      <View padding="size-100">
        <Flex direction="column" gap="size-100">
          <div
            css={css`
              display: flex;
              flex-direction: row;
              width: 100%;
              overflow: hidden;
              --gap: var(--ac-global-dimension-size-100);
              --input-width: 100px;

              gap: var(--gap);
              & > * {
                flex-basis: calc(50% - var(--gap));
                min-width: var(--input-width);
                flex-grow: 1;
              }

              input.react-aria-Input {
                min-width: var(--input-width);
              }

              flex-wrap: wrap;
            `}
          >
            <Controller
              name="label"
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { invalid, error },
              }) => (
                <TextField
                  isReadOnly={isReadOnly}
                  isInvalid={invalid}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value?.toString() || ""}
                  size="S"
                >
                  <Label>Label</Label>
                  <Input placeholder="e.x. good, bad" />
                  {error ? (
                    <FieldError>{error.message}</FieldError>
                  ) : (
                    <Text slot="description">A categorical label</Text>
                  )}
                </TextField>
              )}
            />
            <Controller
              name="score"
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { invalid, error },
              }) => (
                <TextField
                  type="number"
                  isReadOnly={isReadOnly}
                  isInvalid={invalid}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value?.toString() || ""}
                  size="S"
                >
                  <Label>Score</Label>
                  <Input placeholder="e.x. 0.8" />
                  {error ? (
                    <FieldError>{error.message}</FieldError>
                  ) : (
                    <Text slot="description">A numeric grade</Text>
                  )}
                </TextField>
              )}
            />
          </div>
          <details open={!defaultDetailsCollapsed} css={detailsCSS}>
            <summary>Annotation Details</summary>
            <View paddingTop="size-50">
              <Controller
                name="explanation"
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { invalid, error },
                }) => (
                  <TextField
                    isReadOnly={isReadOnly}
                    isInvalid={invalid}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value?.toString() || ""}
                    size="S"
                  >
                    <Label>Explanation</Label>
                    <TextArea />
                    {error ? (
                      <FieldError>{error.message}</FieldError>
                    ) : (
                      <Text slot="description">
                        Why this score or label was given
                      </Text>
                    )}
                  </TextField>
                )}
              />
            </View>
          </details>
        </Flex>
      </View>
      <>
        {!isReadOnly ? (
          <View
            paddingBottom="size-100"
            paddingEnd="size-100"
            paddingStart="size-100"
          >
            <Flex direction="row" justifyContent="end">
              <Button
                variant={isDirty ? "primary" : "default"}
                type="submit"
                size="S"
                isDisabled={!isValid || !isDirty || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </Flex>
          </View>
        ) : null}
      </>
    </Form>
  );
}
