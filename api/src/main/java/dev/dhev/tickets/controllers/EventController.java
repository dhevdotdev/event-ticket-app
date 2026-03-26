package dev.dhev.tickets.controllers;

import static dev.dhev.tickets.util.JwtUtil.parseUserId;

import dev.dhev.tickets.api.requests.CreateEventRequest;
import dev.dhev.tickets.application.command.CreateEventCommand;
import dev.dhev.tickets.application.command.UpdateEventCommand;
import dev.dhev.tickets.api.requests.UpdateEventRequest;
import dev.dhev.tickets.api.responses.CreateEventResponse;
import dev.dhev.tickets.api.responses.EventDetailsResponse;
import dev.dhev.tickets.api.responses.EventSummaryResponse;
import dev.dhev.tickets.api.responses.UpdateEventResponse;
import dev.dhev.tickets.domain.entities.Event;
import dev.dhev.tickets.mappers.EventMapper;
import dev.dhev.tickets.services.EventService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/events")
@RequiredArgsConstructor
public class EventController {

  private final EventMapper eventMapper;
  private final EventService eventService;

  @PostMapping
  public ResponseEntity<CreateEventResponse> createEvent(
      @AuthenticationPrincipal Jwt jwt,
      @Valid @RequestBody CreateEventRequest request) {
    CreateEventCommand createEventCommand = eventMapper.toCommand(request);
    UUID userId = parseUserId(jwt);

    Event createdEvent = eventService.createEvent(userId, createEventCommand);
    CreateEventResponse response = eventMapper.toCreateEventResponse(createdEvent);
    return new ResponseEntity<>(response, HttpStatus.CREATED);
  }

  @PutMapping(path = "/{eventId}")
  public ResponseEntity<UpdateEventResponse> updateEvent(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable UUID eventId,
      @Valid @RequestBody UpdateEventRequest request) {
    UpdateEventCommand updateEventCommand = eventMapper.toCommand(request);
    UUID userId = parseUserId(jwt);

    Event updatedEvent = eventService.updateEventForOrganizer(
        userId, eventId, updateEventCommand
    );

    UpdateEventResponse response = eventMapper.toUpdateEventResponse(
        updatedEvent);

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<Page<EventSummaryResponse>> listEvents(
      @AuthenticationPrincipal Jwt jwt, Pageable pageable
  ) {
    UUID userId = parseUserId(jwt);
    Page<Event> events = eventService.listEventsForOrganizer(userId, pageable);
    return ResponseEntity.ok(
        events.map(eventMapper::toEventSummaryResponse)
    );
  }

  @GetMapping(path = "/{eventId}")
  public ResponseEntity<EventDetailsResponse> getEvent(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable UUID eventId
  ) {
    UUID userId = parseUserId(jwt);
    return eventService.getEventForOrganizer(userId, eventId)
        .map(eventMapper::toEventDetailsResponse)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping(path = "/{eventId}")
  public ResponseEntity<Void> deleteEvent(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable UUID eventId
  ) {
    UUID userId = parseUserId(jwt);
    eventService.deleteEventForOrganizer(userId, eventId);
    return ResponseEntity.noContent().build();
  }
}
