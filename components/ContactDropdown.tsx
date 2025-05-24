'use client';

import { useState } from 'react';
import { Button } from "./ui/button";
import Link from "next/link";
import { Mail, Phone, Linkedin, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactDropdown() {
  return (
    <Link href="/contact">
      <Button variant="ghost">Contact Us</Button>
    </Link>
  );
}
