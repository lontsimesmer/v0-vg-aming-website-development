# VGaming Battle Arena - Webhook Field Mapping Reference

## Architecture

The form submission follows this flow:

```
[User fills form] → [Submit button clicked] → [Client-side validation]
                                                      ↓
                                          [POST to /api/register]
                                                      ↓
                                          [Server-side API Route]
                                                      ↓
                                          [POST to GHL Webhook]
                                                      ↓
                                          [GHL Workflow Triggered]
                                                      ↓
                                          [User redirected to /thank-you]
```

## API Endpoint (Internal)
```
POST /api/register
```
This server-side endpoint handles validation and forwards data to GHL.

## GHL Webhook Endpoint
```
POST https://services.leadconnectorhq.com/hooks/B5v2sbcLstGABgVo9xIG/webhook-trigger/f62f1f2e-c88f-404a-8431-e9a791fecb6a
```

## Content Type
```
Content-Type: application/json
```

---

## Field Mapping

| Field Name | Type | Description (EN) | Description (FR) | Example Value |
|------------|------|------------------|------------------|---------------|
| `fullName` | String | Full name of the participant | Nom et prénom du participant | `"Jean Dupont"` |
| `pseudo` | String | Gamertag / Username | Pseudo du joueur | `"ProGamer237"` |
| `birthDate` | String | Date of birth (YYYY-MM-DD format) | Date de naissance | `"1995-08-15"` |
| `birthPlace` | String | Place of birth | Lieu de naissance | `"Yaoundé, Cameroun"` |
| `howHeard` | String | How the person heard about VGaming (resolved value) | Comment la personne a entendu parler de VGaming | `"Social Media"` or custom text if "other" |
| `howHeardSource` | String | Original dropdown selection | Sélection originale | `"social"`, `"friend"`, `"event"`, or `"other"` |
| `photo` | String | Base64 encoded photo (data URI format) | Photo encodée en Base64 | `"data:image/jpeg;base64,/9j/4AAQ..."` |
| `phone` | String | Phone number | Numéro de téléphone | `"+237 698 453 633"` |
| `level` | String | Player skill level | Niveau du joueur | `"amateur"` or `"professional"` |
| `hasTeam` | String | Has an Ultimate Team | A une équipe Ultimate Team | `"yes"` or `"no"` |
| `categories` | String | Selected competition categories (comma-separated) | Catégories de compétition sélectionnées | `"fc26, billiard, chess"` |
| `language` | String | Form language at submission | Langue du formulaire | `"en"` or `"fr"` |
| `submittedAt` | String | ISO 8601 timestamp of submission | Horodatage de soumission | `"2026-04-04T12:30:45.123Z"` |

---

## Detailed Field Specifications

### fullName
- **Form Label (EN):** Full Name
- **Form Label (FR):** Nom et Prénom
- **Required:** Yes
- **Validation:** Text input

### pseudo
- **Form Label (EN):** Gamertag / Pseudo
- **Form Label (FR):** Pseudo
- **Required:** Yes
- **Validation:** Text input

### birthDate
- **Form Label (EN):** Date of Birth
- **Form Label (FR):** Date de Naissance
- **Required:** Yes
- **Format:** YYYY-MM-DD (HTML date input)

### birthPlace
- **Form Label (EN):** Place of Birth
- **Form Label (FR):** Lieu de Naissance
- **Required:** Yes
- **Validation:** Text input

### howHeard
- **Form Label (EN):** How did you hear about VGaming and this tournament?
- **Form Label (FR):** Comment avez-vous entendu parler de V Gaming et du tournoi?
- **Required:** Yes
- **Logic:** If `howHeardSource` is `"other"`, this field contains the custom text entered by user. Otherwise, it contains the selected option value.

### howHeardSource
- **Description:** The raw dropdown selection value
- **Possible Values:**
  | Value | Label (EN) | Label (FR) |
  |-------|------------|------------|
  | `social` | Social Media | Réseaux Sociaux |
  | `friend` | Friend / Word of Mouth | Ami / Bouche à oreille |
  | `event` | Previous Event | Événement précédent |
  | `other` | Other | Autre |

### photo
- **Form Label (EN):** Photo (visible face) - Will be used for match announcements
- **Form Label (FR):** Photo (visage visible) - Sera utilisée pour annoncer les confrontations
- **Required:** Yes
- **Format:** Base64 Data URI (e.g., `data:image/jpeg;base64,...`)
- **Accepted Types:** JPEG, PNG, GIF, WebP
- **Note:** This photo will be displayed on competition panels to announce matchups

### phone
- **Form Label (EN):** Phone Number
- **Form Label (FR):** Numéro de Téléphone
- **Required:** Yes
- **Format:** Tel input (any format accepted)

### level
- **Form Label (EN):** Player Level
- **Form Label (FR):** Niveau du Joueur
- **Required:** Yes
- **Possible Values:**
  | Value | Label (EN) | Label (FR) |
  |-------|------------|------------|
  | `amateur` | Amateur | Amateur |
  | `professional` | Professional | Professionnel |

### hasTeam
- **Form Label (EN):** Do you have an Ultimate Team?
- **Form Label (FR):** As-tu une équipe Ultimate Team?
- **Required:** Yes
- **Possible Values:**
  | Value | Label (EN) | Label (FR) |
  |-------|------------|------------|
  | `yes` | Yes | Oui |
  | `no` | No | Non |

### categories
- **Form Label (EN):** Select your categories
- **Form Label (FR):** Sélectionnez vos catégories
- **Required:** Yes (at least one)
- **Format:** Comma-separated string
- **Possible Values:**
  | Key | Label |
  |-----|-------|
  | `fc26` | FC26 |
  | `billiard` | Billard |
  | `checkers` | Jeu de Dames |
  | `chess` | Échecs |
- **Example:** `"fc26, billiard"` or `"fc26, billiard, checkers, chess"`

### language
- **Description:** The language the form was displayed in when submitted
- **Possible Values:** `"en"` (English) or `"fr"` (French)

### submittedAt
- **Description:** Automatic timestamp when form was submitted
- **Format:** ISO 8601 (e.g., `2026-04-04T12:30:45.123Z`)
- **Timezone:** UTC

---

## Sample JSON Payload

```json
{
  "fullName": "Jean-Pierre Kamga",
  "pseudo": "JPK_Gaming",
  "birthDate": "1998-03-22",
  "birthPlace": "Douala, Cameroun",
  "howHeard": "Social Media",
  "howHeardSource": "social",
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/...",
  "phone": "+237 698 453 633",
  "level": "amateur",
  "hasTeam": "yes",
  "categories": "fc26, billiard",
  "language": "fr",
  "submittedAt": "2026-04-04T14:25:30.456Z"
}
```

---

## Notes

1. **Server-Side API:** The form submits to `/api/register` which then forwards the data to GHL. This avoids CORS issues and provides proper error handling.

2. **Photo Handling:** The photo is converted to Base64 on the client side before submission. Large images may result in large payloads.

3. **GHL Workflow:** The webhook triggers your GHL workflow automatically. Make sure to map the fields in your GHL workflow to contact/custom fields.

4. **Redirect:** After successful submission, users are redirected to `/thank-you` page.

5. **Error Handling:** If submission fails, users see an alert message in their selected language. Server errors are logged for debugging.

## GHL Field Mapping Recommendations

| Webhook Field | GHL Contact Field | Notes |
|---------------|-------------------|-------|
| `firstName` | First Name | Auto-extracted from fullName |
| `lastName` | Last Name | Auto-extracted from fullName |
| `phone` | Phone | Standard contact field |
| `fullName` | Full Name (Custom) | Or use firstName/lastName |
| `pseudo` | Custom Field | Create as `vgaming_pseudo` |
| `birthDate` | Custom Field | Create as `vgaming_birth_date` |
| `birthPlace` | Custom Field | Create as `vgaming_birth_place` |
| `howHeard` | Custom Field | Create as `vgaming_how_heard` |
| `level` | Custom Field | Create as `vgaming_player_level` |
| `hasTeam` | Custom Field | Create as `vgaming_has_team` |
| `categories` | Custom Field | Create as `vgaming_categories` |
| `source` | Lead Source | Always "VGaming Battle Arena Registration" |

---

## Contact Information (from website)

- **Location:** Montée Anor - Bastos, Yaoundé, Cameroun
- **Phone:** +237 698 45 36 33 / +237 677 16 71 63
- **Email:** contact@vgaming.cm
