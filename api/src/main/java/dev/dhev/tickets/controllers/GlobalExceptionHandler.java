package dev.dhev.tickets.controllers;

import dev.dhev.tickets.api.responses.ApiError;
import dev.dhev.tickets.exceptions.EventNotFoundException;
import dev.dhev.tickets.exceptions.EventUpdateException;
import dev.dhev.tickets.exceptions.QrCodeGenerationException;
import dev.dhev.tickets.exceptions.QrCodeNotFoundException;
import dev.dhev.tickets.exceptions.TicketNotFoundException;
import dev.dhev.tickets.exceptions.TicketTypeNotFoundException;
import dev.dhev.tickets.exceptions.TicketsSoldOutException;
import dev.dhev.tickets.exceptions.UserNotFoundException;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {


  @ExceptionHandler(TicketNotFoundException.class)
  public ResponseEntity<ApiError> handleTicketNotFoundException(TicketNotFoundException ex) {
    log.error("Caught TicketNotFoundException", ex);
    ApiError errorDto = new ApiError();
    errorDto.setError("Ticket not found");
    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }


  @ExceptionHandler(TicketsSoldOutException.class)
  public ResponseEntity<ApiError> handleTicketsSoldOutException(TicketsSoldOutException ex) {
    log.error("Caught TicketsSoldOutException", ex);
    ApiError errorDto = new ApiError();
    errorDto.setError("Tickets are sold out for this ticket type");
    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(QrCodeNotFoundException.class)
  public ResponseEntity<ApiError> handleQrCodeNotFoundException(QrCodeNotFoundException ex) {
    log.error("Caught QrCodeNotFoundException", ex);
    ApiError errorDto = new ApiError();
    errorDto.setError("QR code not found");
    return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(QrCodeGenerationException.class)
  public ResponseEntity<ApiError> handleQrCodeGenerationException(QrCodeGenerationException ex) {
    log.error("Caught QrCodeGenerationException", ex);
    ApiError errorDto = new ApiError();
    errorDto.setError("Unable to generate QR Code");
    return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(EventUpdateException.class)
  public ResponseEntity<ApiError> handleEventUpdateException(EventUpdateException ex) {
    log.error("Caught EventUpdateException", ex);
    ApiError errorDto = new ApiError();
    errorDto.setError("Unable to update event");
    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(TicketTypeNotFoundException.class)
  public ResponseEntity<ApiError> handleTicketTypeNotFoundException(
      TicketTypeNotFoundException ex) {
    log.error("Caught TicketTypeNotFoundException", ex);
    ApiError errorDto = new ApiError();
    errorDto.setError("Ticket type not found");
    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(EventNotFoundException.class)
  public ResponseEntity<ApiError> handleEventNotFoundException(EventNotFoundException ex) {
    log.error("Caught EventNotFoundException", ex);
    ApiError errorDto = new ApiError();
    errorDto.setError("Event not found");
    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ApiError> handleUserNotFoundException(UserNotFoundException ex) {
    log.error("Caught UserNotFoundException", ex);
    ApiError errorDto = new ApiError();
    errorDto.setError("User not found");
    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleMethodArgumentNotValidException(
      MethodArgumentNotValidException ex
  ) {
    log.error("Caught MethodArgumentNotValidException", ex);
    ApiError errorDto = new ApiError();

    BindingResult bindingResult = ex.getBindingResult();
    List<FieldError> fieldErrors = bindingResult.getFieldErrors();
    String errorMessage = fieldErrors.stream()
        .findFirst()
        .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
        .orElse("Validation error occurred");

    errorDto.setError(errorMessage);
    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ApiError> handleConstraintViolation(
      ConstraintViolationException ex
  ) {
    log.error("Caught ConstraintViolationException", ex);
    ApiError errorDto = new ApiError();

    String errorMessage = ex.getConstraintViolations()
        .stream()
        .findFirst()
        .map(violation ->
            violation.getPropertyPath() + ": " + violation.getMessage()
        ).orElse("Constraint violation occurred");

    errorDto.setError(errorMessage);
    return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiError> handleException(Exception ex) {
    log.error("Caught exception", ex);
    ApiError errorDto = new ApiError();
    errorDto.setError("An unknown error occurred");
    return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
