import { CurrencyPipe, formatCurrency } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCategory } from '@app/_shared/models/master-data/product-category.model';
import { Product } from '@app/_shared/models/master-data/product.model';
import { Subcategory } from '@app/_shared/models/master-data/subcategory.model';
import { ProductCategoryService } from '@app/_shared/services/product-category.service';
import { ProductService } from '@app/_shared/services/product.service';
import { SubcategoryService } from '@app/_shared/services/subcategory.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  addProductForm!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];
  messages: string[] = [];
  filteredSubcategories: Subcategory[] = [];

  productCategories: ProductCategory[] = [];
  product!: Product;
  subcategories: Subcategory[] = [];

  selectedFile!: File;
  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;

  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private subcategoryService: SubcategoryService,
    private router: Router
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.createForm();
    // this.addProductForm.get('valueOnHand')?.disable();
  }

  uploadImage(event: any) {
    console.log(event.target.value);
    this.selectedFile = event.target.files[0];
  }

  changePurchasePrice(event: any) {
    const input = parseFloat(event.target.value).toFixed(2);

    this.addProductForm.patchValue({ purchasePrice: input });
  }

  onAddImage(event: any) {
    this.selectedFile = <File>event.target.files[0];
    // this.addProductForm.patchValue({ imageFile: this.product.imageFile });
  }

  onReset() {
    this.submitted = false;
    this.addProductForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addProductForm.status === 'VALID';
    console.log(this.addProductForm);
  }

  onSubmit() {
    console.warn(this.onValidate(), this.addProductForm.value);
    if (this.onValidate()) {
      this.messages = [];
      // TODO: Submit form value
      console.warn(this.addProductForm.value);

      // debugger;
      const frmData: Product = Object.assign(this.addProductForm.value);
      frmData.imageFile = this.selectedFile;
      frmData.imageName = this.selectedFile.name

      console.log(frmData)
      
      this.productService.createProduct(frmData).subscribe({
        next: (response: any) => {
          if (response.isSuccess == true || response.statusCode == 201) {
            debugger;
            // alert('SUCCESS!');
            this.router.navigateByUrl('/master-data/products').then(() => {
              debugger;
              this.toastrColor = 'success';
              this.messages.push('Successfully added the Product');
              this.visible = true;
            });
          }
        },
        error: (error: any) => {
          this.toastrColor = 'danger';
          this.visible = true;
          if (error.error.CustomError) {
            this.messages.push(error.error.CustomError);
          } else {
            if (error.error.errors) {
              this.messages = error.error.errors;
            } else {
              this.messages.push(error.error);
            }
          }
        },
      });
    }
  }

  filterSubcategories(selectedCategoryId: any) {
    // Assuming your subcategory model has a property that links to the category, e.g., categoryId
    this.filteredSubcategories = this.subcategories.filter(subcategory => subcategory.productCategoryId === selectedCategoryId);
  }

  createForm() {
    this.addProductForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageName: [''],
      productCategoryId: ['', [Validators.required]],
      subcategoryId: ['', [Validators.required]],
      imageFile: [],
    });
    this.formControls = Object.keys(this.addProductForm.controls);
    this.addProductForm.get('productCategoryId')!.valueChanges.subscribe(selectedCategoryId => {
      this.filterSubcategories(selectedCategoryId);
    });
    this.productCategoryService.getAllProductCategories().subscribe({
      next: (response: any) => {
        this.productCategories = response.result;
      },
      error: (error: any) => {
        if (error.error.CustomError) {
          this.messages.push(error.error.CustomError);
        } else {
          if (error.error.errors) {
            this.messages = error.error.errors;
          } else {
            this.messages.push(error.error);
          }
        }
      },
    });

    this.subcategoryService.getAllSubcategories().subscribe({
      next: (response: any) => {
        this.subcategories = response.result;
      },
      error: (error: any) => {
        if (error.error.CustomError) {
          this.messages.push(error.error.CustomError);
        } else {
          if (error.error.errors) {
            this.messages = error.error.errors;
          } else {
            this.messages.push(error.error);
          }
        }
      },
    })
  }
}
