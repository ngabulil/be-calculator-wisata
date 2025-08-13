# hotel-be

Simple Express + Sequelize backend. This README explains how to run the app and how to back up / restore the PostgreSQL database using npm scripts.

---

## Install & Run

```bash
npm install
npm run dev
```

---

## Database: Common Tasks

```bash
npm run drop     # Drop database
npm run create   # Create database
npm run seed     # Run all seeders
npm run sync     # Custom DB sync script
```

---

## Backup & Restore

These commands store/read dumps from the `./backup` folder in the project root.

### Backup

```bash
npm run backup
```

Creates a `.dump` file in `./backup/` with a timestamped filename.

### Restore

```bash
npm run restore
```

By default:

* Uses the latest `.dump` in `./backup`
* Restores into a new database named `<DB_NAME>_restore`

### Restore with Flags

Run with:

```bash
npm run restore -- <flags>
```

| Flag     | Values                                             | Purpose                         |
| -------- | -------------------------------------------------- | ------------------------------- |
| `--mode` | `new` (default) \| `overwrite` \| `createfromdump` | Restore mode                    |
| `--file` | path/to/file.dump                                  | Restore from specific dump file |

Examples:

```bash
npm run restore -- --mode=overwrite
npm run restore -- --file=backup/backup_2025-08-14_1012.dump
```

---

## Notes

* Requires PostgreSQL client tools (`pg_dump`, `pg_restore`, `psql`) in PATH
* Restore scripts use safe defaults to avoid permission issues
* Extensions may need to be re-created manually after restore
