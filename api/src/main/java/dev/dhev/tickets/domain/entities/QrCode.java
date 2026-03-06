package dev.dhev.tickets.domain.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "qr_codes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QrCode extends BaseEntity {

  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @Column(name = "status", nullable = false)
  @Enumerated(EnumType.STRING)
  private QrCodeStatus status;

  @Column(name = "value", columnDefinition = "TEXT", nullable = false)
  private String value;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ticket_id")
  private Ticket ticket;

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    QrCode qrCode = (QrCode) o;
    return Objects.equals(id, qrCode.id) && status == qrCode.status && Objects.equals(value,
        qrCode.value) && Objects.equals(getCreatedAt(), qrCode.getCreatedAt()) && Objects.equals(
        getUpdatedAt(), qrCode.getUpdatedAt());
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, status, value, getCreatedAt(), getUpdatedAt());
  }
}
