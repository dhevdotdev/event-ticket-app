package dev.dhev.tickets.services;

import dev.dhev.tickets.domain.entities.QrCode;
import dev.dhev.tickets.domain.entities.Ticket;
import java.util.UUID;

public interface QrCodeService {

  QrCode generateQrCode(Ticket ticket);

  byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId);
}
